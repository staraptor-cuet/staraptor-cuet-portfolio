// The whole answer pipeline. One visitor question costs at most: 1 guard call, 1 rewrite call (only for
// follow-ups or weak matches) and 1 answer call. Everything else is plain code.
import { createGroq } from '@ai-sdk/groq';
import { APICallError, createUIMessageStream, generateText, streamText } from 'ai';
import type { ModelMessage } from 'ai';
import { CACHE_VERSION, LIMITS, MODELS, chatMode } from './config';
import { followups, selectFacts } from './facts';
import {
  BUSY_MESSAGE,
  INSTRUCTIONS,
  NO_ANSWER,
  REFUSAL_INJECTION,
  REWRITE_INSTRUCTIONS,
  buildContext,
  buildUserTurn,
} from './prompt';
import { matchShare, search } from './retrieve';
import { OFF_TOPIC_REPLY, cannedReply, isOffTopic } from './smalltalk';
import type { Hit } from './retrieve';
import {
  cacheGet,
  cacheSet,
  checkVisitorLimit,
  isCooling,
  setCooling,
  sha,
  takeGlobalBudget,
  utcDay,
  writeLog,
} from './store';
import type { ChatStatus, KbChunk, RaptorData, RaptorMessage, SourceRef } from './types';
import kb from './generated/kb-index.json';

export interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatInput {
  question: string;
  history: Turn[];
  page?: string;
  visitor: string;
  signal?: AbortSignal;
}

type Cards = { [K in keyof RaptorData]?: RaptorData[K] };

interface CachedAnswer {
  text: string;
  sources: SourceRef[];
  cards: Cards;
  topic?: string;
}

function apiKeys(): string[] {
  return (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

const LOCAL_INJECTION =
  /(ignore|disregard|forget) (all |any |your |the )?(previous|prior|above|earlier|system) (instructions|prompts?|rules)|(reveal|print|show|repeat|output) (me )?(your |the )?(system|hidden|initial) (prompt|instructions|message)|\b(DAN|developer mode|jailbreak|do anything now)\b|you are now (?!on)|pretend (to be|you are)|act as (?!a guide)/i;

/** Per-model options: gpt-oss reasons before answering (keep it short); qwen must not print its thinking. */
function modelOptions(modelId: string): { extraTokens: number; providerOptions: { groq: Record<string, string> } } {
  if (modelId.startsWith('openai/gpt-oss')) return { extraTokens: 600, providerOptions: { groq: { reasoningEffort: 'low' } } };
  return { extraTokens: 900, providerOptions: { groq: { reasoningFormat: 'hidden' } } };
}

// Romanised Bangla ("Banglish") uses Latin letters, so it is recognised by its most common function words.
const BANGLISH = new Set(
  'ami tumi apni amra tomra tomader amader apnader tomar amar ki ke kara kobe kothay kivabe kibhabe keno koto kon konta kemon ache achen acho hobe hoy korbo korte kora koren koro jabe jay chai chan bolo bolun bolen jante dorkar lagbe theke niye jonno shathe sathe er ta eta ei oi shob sob kichu ektu onek bhalo valo naki nai nei vai bhai apu'.split(' '),
);

// Frequent question and function words of other Latin-script languages (words that are also English are left out).
const OTHER_LATIN = new Set(
  'nedir hangi nasil kimdir kac icin takim yarisma hakkinda que quien cual cuando donde equipo quel quelle comment pourquoi quand equipe avec wie wer welche warum wann und ist nicht apa siapa bagaimana kapan dimana yang berapa kya kaise kaun kitne kitna aap aapki aapke hain kahan kab kyun'.split(' '),
);

/** True when the visitor did not write in English: another script, or Banglish. */
function isForeign(question: string): boolean {
  if (/[^\u0000-\u024F\u2000-\u206F\u20A0-\u20CF]/.test(question)) return true;
  const words = question.toLowerCase().split(/[^a-zÀ-ɏ]+/).filter(Boolean);
  if (words.length === 0) return false;
  // two or more words with accented Latin letters (Turkish, French, Spanish, German...); one alone can be a name such as "Türkiye"
  if (words.filter((w) => /[À-ɏ]/.test(w)).length >= 2) return true;
  if (words.filter((w) => OTHER_LATIN.has(w)).length >= 2) return true;
  const hits = words.filter((w) => BANGLISH.has(w)).length;
  return hits >= 2 || (hits >= 1 && words.length <= 3);
}

const ENGLISH_NOTE = 'I reply in English.\n\n';

/** Removes <think>...</think> blocks from a token stream, even when a tag is split across chunks. */
function thinkFilter(): (piece: string) => string {
  let inside = false;
  let carry = '';
  return (piece: string) => {
    let s = carry + piece;
    carry = '';
    let out = '';
    for (;;) {
      if (inside) {
        const end = s.indexOf('</think>');
        if (end === -1) {
          carry = s.slice(-8);
          return out;
        }
        s = s.slice(end + 8);
        inside = false;
      } else {
        const start = s.indexOf('<think>');
        if (start === -1) {
          const lt = s.lastIndexOf('<');
          if (lt !== -1 && '<think>'.startsWith(s.slice(lt))) {
            carry = s.slice(lt);
            s = s.slice(0, lt);
          }
          return out + s;
        }
        out += s.slice(0, start);
        s = s.slice(start + 7);
        inside = true;
      }
    }
  };
}

/** Prompt Guard 2 returns a probability that the text is an injection or jailbreak. Fails open. */
async function isInjection(question: string, key: string, signal?: AbortSignal): Promise<boolean> {
  if (LOCAL_INJECTION.test(question)) return true;
  try {
    const { text } = await generateText({
      model: createGroq({ apiKey: key })(MODELS.guard),
      prompt: question.slice(0, 1500),
      maxRetries: 0,
      abortSignal: signal ?? AbortSignal.timeout(4000),
    });
    const t = text.trim();
    const score = Number.parseFloat(t);
    if (Number.isFinite(score)) return score >= LIMITS.guardThreshold;
    return /^(malicious|jailbreak|injection|unsafe)/i.test(t);
  } catch {
    return false;
  }
}

async function rewriteQuery(question: string, history: Turn[], key: string): Promise<string | null> {
  const convo = history
    .slice(-4)
    .map((t) => `${t.role === 'user' ? 'Visitor' : 'Assistant'}: ${t.text.slice(0, 300)}`)
    .join('\n');
  for (const modelId of MODELS.rewrite) {
    if (await isCooling(`rw:${modelId}`)) continue;
    const opt = modelOptions(modelId);
    try {
      const { text } = await generateText({
        model: createGroq({ apiKey: key })(modelId),
        instructions: REWRITE_INSTRUCTIONS,
        prompt: `${convo ? `Conversation:\n${convo}\n\n` : ''}Latest message: ${question}`,
        maxOutputTokens: 80 + opt.extraTokens,
        temperature: 0,
        providerOptions: opt.providerOptions,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(8000),
      });
      const q = plain(text)
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim()
        .replace(/^["']|["']$/g, '')
        .split('\n')[0]
        .slice(0, 300);
      if (q.length > 2) return q;
    } catch (err) {
      if (APICallError.isInstance(err) && err.statusCode === 429) await setCooling(`rw:${modelId}`, retryAfterSeconds(err));
    }
  }
  return null;
}

/** gpt-oss models like typographic characters: 【1】 citations, narrow spaces, non-breaking hyphens. */
function plain(s: string): string {
  return s
    .replace(/[【〖]/g, '[')
    .replace(/[】〗]/g, ']')
    .replace(/[     ]/g, ' ')
    .replace(/[‐‑]/g, '-')
    .replace(/[​-‍⁠﻿]/g, '');
}

function retryAfterSeconds(err: unknown): number {
  if (APICallError.isInstance(err)) {
    const h = err.responseHeaders?.['retry-after'];
    const n = h ? Number.parseFloat(h) : NaN;
    if (Number.isFinite(n)) return n;
    if (err.statusCode === 429) return 60;
  }
  return 30;
}

function mergeChunks(extra: KbChunk[], hits: Hit[]): KbChunk[] {
  const seen = new Set<string>();
  const out: KbChunk[] = [];
  for (const c of [...extra, ...hits.map((h) => h.chunk)]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out.slice(0, LIMITS.retrievedChunks + extra.length);
}

/** Keep only the sources the answer actually cites; if it cites none, keep the top two. */
function citedSources(text: string, sources: SourceRef[]): SourceRef[] {
  const cited = new Set(Array.from(text.matchAll(/\[(\d{1,2})\]/g), (m) => Number(m[1])));
  const used = sources.filter((s) => cited.has(s.n));
  return used.length ? used : sources.slice(0, 2);
}

export function runChat(input: ChatInput): ReadableStream {
  const started = Date.now();
  const logId = sha(`${input.visitor}|${started}|${input.question}`);

  return createUIMessageStream<RaptorMessage>({
    onError: () => 'The assistant hit an error. Please try again in a moment.',
    execute: async ({ writer }) => {
      const textId = 'answer';
      let answer = '';
      let mode: ChatStatus = 'ai';
      let modelUsed: string | undefined;
      let flag: string | undefined;
      let sourcesOut: SourceRef[] = [];
      let topic: string | undefined;

      const say = (text: string) => {
        answer += text;
        writer.write({ type: 'text-start', id: textId });
        writer.write({ type: 'text-delta', id: textId, delta: text });
        writer.write({ type: 'text-end', id: textId });
      };
      const sendCards = (cards: Cards) => {
        if (cards.crew) writer.write({ type: 'data-crew', data: cards.crew });
        if (cards.specs) writer.write({ type: 'data-specs', data: cards.specs });
        if (cards.sponsors) writer.write({ type: 'data-sponsors', data: cards.sponsors });
        if (cards.contact) writer.write({ type: 'data-contact', data: cards.contact });
      };
      const finish = async () => {
        if (sourcesOut.length) writer.write({ type: 'data-sources', data: { items: sourcesOut } });
        writer.write({ type: 'data-followups', data: { items: followups(topic, input.question) } });
        writer.write({ type: 'data-status', data: { mode, logId } });
        writer.write({ type: 'finish' });
        await writeLog({
          id: logId,
          t: new Date().toISOString(),
          visitor: input.visitor,
          q: input.question,
          a: answer,
          mode,
          model: modelUsed,
          sources: sourcesOut.map((s) => s.url),
          ms: Date.now() - started,
          flag,
        });
      };
      /** No LLM: the closest knowledge passage, shown as-is with its source. */
      const faqAnswer = (lead: string) => {
        const hits = search(input.question, 1);
        const facts = selectFacts(input.question);
        // Show a passage only when it clearly matches: at least half of the question's content words appear in it.
        const share = hits.length ? matchShare(input.question, hits[0].chunk) : 0;
        // No model checks this path, so a question without any in-scope word is refused whatever it matched.
        if (!isForeign(input.question) && isOffTopic(input.question, facts.extraChunks.length > 0, 0)) {
          flag = flag ?? 'offtopic';
          say(OFF_TOPIC_REPLY);
          return;
        }
        let close = facts.extraChunks.length > 0;
        if (!close && hits.length) close = share >= 0.5;
        if (!close) {
          say(
            lead
              ? "The AI assistant is at its usage limit right now and I couldn't find a close match for your question in our FAQ. Please try again later, or email staraptorcuet@gmail.com."
              : NO_ANSWER,
          );
          return;
        }
        const c = facts.extraChunks[0] ?? hits[0].chunk;
        topic = c.topic;
        sourcesOut = [{ n: 1, title: c.title, heading: c.heading, url: c.url, lastVerified: c.last_verified }];
        say(`${lead ? `${lead}\n\n` : ''}**${c.heading}**\n\n${c.text} [1]`);
        sendCards(facts.cards);
      };

      writer.write({ type: 'start' });

      // 1. Kill switch
      const cm = chatMode();
      if (cm === 'off') {
        mode = 'off';
        say('The assistant is switched off at the moment. Please use the Contact page.');
        return finish();
      }

      // 2. Per-visitor limits
      const limit = await checkVisitorLimit(input.visitor);
      if (!limit.ok) {
        mode = 'blocked';
        flag = `limit:${limit.reason}`;
        say(
          limit.reason === 'minute'
            ? 'You are sending messages quickly. Please wait a minute and ask again.'
            : 'You have reached the daily question limit for the assistant. Please come back tomorrow or email staraptorcuet@gmail.com.',
        );
        return finish();
      }

      // 3. Greetings and small talk never reach the model
      const canned = cannedReply(input.question);
      if (canned) {
        mode = 'cached';
        flag = canned.flag;
        topic = canned.topic;
        say(canned.reply);
        if (canned.contactCard) sendCards(selectFacts('contact').cards);
        return finish();
      }

      // 4. Answer cache (first-turn questions only; the key changes whenever the knowledge base is rebuilt)
      const builtAt = (kb as { built_at: string }).built_at;
      const cacheKey = sha(`${CACHE_VERSION}|${builtAt}|${input.question.toLowerCase().replace(/[ -/:-@[-`{-¿ -⁯]+/g, ' ').trim()}`);
      if (input.history.length === 0) {
        const hit = await cacheGet<CachedAnswer>(cacheKey);
        if (hit) {
          mode = 'cached';
          topic = hit.topic;
          sourcesOut = hit.sources;
          say(hit.text);
          sendCards(hit.cards);
          return finish();
        }
      }

      const keys = apiKeys();
      if (cm === 'faq' || keys.length === 0) {
        mode = 'faq';
        faqAnswer(cm === 'faq' ? '' : BUSY_MESSAGE);
        return finish();
      }

      // 5. Prompt-injection screen
      if (await isInjection(input.question, keys[0])) {
        mode = 'blocked';
        flag = 'injection';
        say(REFUSAL_INJECTION);
        return finish();
      }

      // 6. Retrieval (+ one rewrite call for follow-ups, Bangla script, or weak matches)
      let query = input.question;
      let hits = search(query, LIMITS.retrievedChunks);
      let facts = selectFacts(query);
      const weak = hits.length === 0 || hits[0].score < 3;
      const foreign = isForeign(input.question);
      if (input.history.length > 0 || foreign || (weak && facts.extraChunks.length === 0)) {
        const rewritten = await rewriteQuery(input.question, input.history, keys[0]);
        if (rewritten) {
          query = rewritten;
          const better = search(query, LIMITS.retrievedChunks);
          if (better.length && (!hits.length || better[0].score >= hits[0].score)) hits = better;
          const f2 = selectFacts(query);
          facts = { extraChunks: f2.extraChunks.length ? f2.extraChunks : facts.extraChunks, cards: { ...facts.cards, ...f2.cards } };
        }
      }
      const chunks = mergeChunks(facts.extraChunks, hits);
      topic = chunks[0]?.topic;

      // Off-topic guardrail: questions unrelated to the team or drone engineering never reach the answer model.
      // Follow-ups and non-English questions are judged on their English rewrite; without one they pass through.
      const judged = query !== input.question || (input.history.length === 0 && !foreign);
      if (judged) {
        const bestShare = hits.length ? Math.max(matchShare(query, hits[0].chunk), matchShare(input.question, hits[0].chunk)) : 0;
        if (isOffTopic(query, facts.extraChunks.length > 0, bestShare) && isOffTopic(input.question, facts.extraChunks.length > 0, bestShare)) {
          mode = 'cached';
          flag = 'offtopic';
          topic = 'faq';
          say((foreign ? ENGLISH_NOTE : '') + OFF_TOPIC_REPLY);
          return finish();
        }
      }

      if (chunks.length === 0) {
        mode = 'cached';
        flag = 'no-context';
        say(
          (foreign ? ENGLISH_NOTE : '') +
            "I couldn't find that in the team's published information. I can help with Team Staraptor CUET, the Staraptor VTOL V1 aircraft, the METU VTOL competition, TEKNOFEST, sponsorship and joining the team. For anything else, email staraptorcuet@gmail.com.",
        );
        return finish();
      }

      // 7. Site-wide daily budget
      if (!(await takeGlobalBudget())) {
        mode = 'busy';
        flag = 'global-budget';
        faqAnswer(BUSY_MESSAGE);
        return finish();
      }

      // 8. Answer: first model/key that starts streaming wins
      const ctx = buildContext(chunks);
      const messages: ModelMessage[] = [
        ...input.history.map((t) => ({ role: t.role, content: t.text }) as ModelMessage),
        { role: 'user', content: buildUserTurn(input.question, ctx.block, utcDay(), input.page) },
      ];

      let streamed = false;
      outer: for (let k = 0; k < keys.length; k++) {
        const groq = createGroq({ apiKey: keys[k] });
        for (const modelId of MODELS.answer) {
          const coolId = `${k}:${modelId}`;
          if (await isCooling(coolId)) continue;
          const opt = modelOptions(modelId);
          const unthink = thinkFilter();
          try {
            const result = streamText({
              model: groq(modelId),
              instructions: INSTRUCTIONS,
              messages,
              temperature: LIMITS.temperature,
              // reasoning models spend part of the output budget on hidden reasoning
              maxOutputTokens: LIMITS.maxOutputTokens + opt.extraTokens,
              providerOptions: opt.providerOptions,
              maxRetries: 0,
              abortSignal: input.signal,
              onError: () => {},
            });
            const reader = result.stream.getReader();
            let opened = false;
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value.type === 'error') {
                if (opened) throw new Error('stream-broke');
                throw value.error;
              }
              if (value.type === 'text-delta' && value.text) {
                let piece = plain(unthink(value.text));
                if (!opened) piece = piece.replace(/^\s+/, '').replace(/^I reply in English\.\s*/i, '');
                if (!piece) continue;
                if (!opened) {
                  opened = true;
                  writer.write({ type: 'text-start', id: textId });
                  if (foreign) {
                    answer += ENGLISH_NOTE;
                    writer.write({ type: 'text-delta', id: textId, delta: ENGLISH_NOTE });
                  }
                }
                answer += piece;
                writer.write({ type: 'text-delta', id: textId, delta: piece });
              }
            }
            if (!opened) throw new Error('empty-answer');
            writer.write({ type: 'text-end', id: textId });
            modelUsed = modelId;
            streamed = true;
            break outer;
          } catch (err) {
            if (answer) {
              // Text already reached the visitor: close the message instead of starting another model.
              writer.write({ type: 'text-end', id: textId });
              modelUsed = modelId;
              flag = 'partial';
              streamed = true;
              break outer;
            }
            if (input.signal?.aborted) return;
            const status = APICallError.isInstance(err) ? err.statusCode : undefined;
            console.error(`[chat] ${modelId} (key ${k + 1}) failed:`, status ?? (err as Error)?.message);
            await setCooling(coolId, retryAfterSeconds(err));
          }
        }
      }

      if (!streamed) {
        mode = 'busy';
        flag = 'all-models-failed';
        faqAnswer(BUSY_MESSAGE);
        return finish();
      }

      sourcesOut = citedSources(answer, ctx.sources);
      sendCards(facts.cards);
      if (input.history.length === 0 && flag !== 'partial' && answer.length > 20) {
        await cacheSet(cacheKey, { text: answer, sources: sourcesOut, cards: facts.cards, topic } satisfies CachedAnswer);
      }
      return finish();
    },
  });
}

# Raptor: the website assistant

Raptor answers visitor questions about the team, the aircraft, the competitions, sponsorship, recruitment and
VTOL engineering. It answers only from the files in `content/kb/` and `content/facts/`, and cites them.

## How it works

1. A visitor's question goes to `POST /api/chat` (`app/api/chat/route.ts`).
2. The server checks the origin, rate limits and input length, then screens for prompt injection.
3. It searches the knowledge index (keyword search, `lib/chat/retrieve.ts`) and looks up exact facts such as the
   crew roster and specifications (`lib/chat/facts.ts`).
4. One Groq model call writes the answer from those passages only (`lib/chat/prompt.ts`, `lib/chat/pipeline.ts`).
5. The answer streams to the browser with source links and cards.
6. If the Groq quota is used up, or `CHAT_MODE=faq`, visitors get the closest FAQ answer instead.

All tunable values (models, limits) are in `lib/chat/config.ts`.

## Adding or changing knowledge (no coding needed)

1. Edit or add a Markdown file in `content/kb/` (GitHub's web editor works).
2. Every file starts with this block:

   ```
   ---
   title: Short title of the document
   topic: team | aircraft | competition | sponsorship | contact | vtol-engineering | general | faq
   competition: none | metu-vtol | teknofest
   source_url: https://the-main-source-page
   last_verified: 2026-11-13
   owner: your-sub-team
   visibility: public
   ---
   ```

3. Write short sections under `## Heading` lines. Each section must make sense on its own (write "Team Staraptor
   CUET" or "the Staraptor VTOL V1", not "we" or "it") and must end with a line `Source: https://...`.
4. Write only what the source says. If something is not decided or not published, write "Not announced as of
   <date>". The assistant repeats exactly what is written here.
5. Internal material that must not reach the public: set `visibility: internal`. It is then left out of the index.
6. Open a pull request. The build runs `node scripts/build-kb.mjs` and fails if a section has no source, a date is
   missing, or the file contains HTML or hidden characters.

Exact values that the cards show (specifications, sponsors, contact details) are in `content/facts/*.json`. The
crew roster comes from `app/crew/members.ts`, the same file the Crew page uses.

FAQ answers live in `content/kb/faq.md`: one `### Question?` heading per entry. They are also the answers shown
when the AI is unavailable.

## Checking a change

```
node scripts/build-kb.mjs      # validates the knowledge files and prints section and token counts
npm run dev                    # try the assistant locally (needs GROQ_API_KEYS in .env.local)
npm run eval                   # runs the question sets in evals/ against the local server
```

Question sets in `evals/` (`node scripts/eval.mjs <set>` runs one; `--only id1,id2` runs single questions):

| Set | What it checks | Pass mark |
|---|---|---|
| `golden.json` | team, crew, aircraft, sponsors, both competitions | 90% |
| `knowledge.json` | engineering, general drone knowledge, CUET, TEKNOFEST Free Mission | 90% |
| `edge.json` | typos, one-word questions, several questions in one, wrong assumptions, other languages, small talk, empty or unreadable input | 90% |
| `redteam.json` | prompt injection, personal data, invented results, weapons, politics | 100% |

A full run asks about 200 questions and uses most of one free Groq key's daily allowance, so run single sets
while working and the full run before a release.

Links in answers are shown only for the team site and for hosts that a knowledge file cites as a source; the
build writes that list to `lib/chat/generated/link-hosts.json`.

Messages that never reach the model (greetings, thanks, "who are you", empty input, insults, weapon, medical and
political requests) have fixed replies in `lib/chat/smalltalk.ts`.

## Rules the assistant follows

English replies only; answers only from the knowledge base with citations; no invented dates, results, prices or
promises; aircraft figures are labelled as design targets; contact goes to the team email, not to members'
personal emails; no opinions about people; no help with weaponising drones.

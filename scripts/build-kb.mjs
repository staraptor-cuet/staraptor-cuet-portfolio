// Builds the chatbot knowledge index from content/kb/**/*.md.
// Run: node scripts/build-kb.mjs   (runs automatically before `next build` and `next dev`)
// Fails (exit 1) when a file breaks the rules in docs/chatbot/README.md, so bad content never ships.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KB_DIR = join(ROOT, 'content', 'kb');
const OUT_INDEX = join(ROOT, 'lib', 'chat', 'generated', 'kb-index.json');
const OUT_FAQ = join(ROOT, 'public', 'chat-faq.json');

const REQUIRED = ['title', 'topic', 'competition', 'source_url', 'last_verified', 'owner', 'visibility'];
const TOPICS = ['team', 'aircraft', 'competition', 'sponsorship', 'contact', 'vtol-engineering', 'general', 'faq'];
const MAX_CHUNK_CHARS = 2600; // about 650 tokens
const STALE_DAYS = 120;

const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) {
    errors.push(`${file}: missing front-matter block`);
    return { meta: {}, body: raw };
  }
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: raw.slice(m[0].length) };
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Split the body into sections at "## " and "### " headings.
function sections(body) {
  const out = [];
  let h2 = '';
  let cur = null;
  for (const line of body.split(/\r?\n/)) {
    const m2 = line.match(/^##\s+(.*)$/);
    const m3 = line.match(/^###\s+(.*)$/);
    if (m2 || m3) {
      if (cur) out.push(cur);
      if (m2) h2 = m2[1].trim();
      cur = { path: m2 ? [h2] : [h2, m3[1].trim()].filter(Boolean), lines: [] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) out.push(cur);
  return out;
}

const SOURCE_RE = /^Source:\s*(.+)$/im;
const INJECTION_RE = /(ignore (all |any )?(previous|prior|above) instructions|system prompt|you are now|disregard the above)/i;
const HIDDEN_RE = /[​-‏‪-‮⁠-⁤﻿]|[\u{E0000}-\u{E007F}]/u;

const chunks = [];
const faq = [];
const today = new Date();

for (const file of walk(KB_DIR)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const raw = readFileSync(file, 'utf8');
  const { meta, body } = parseFrontMatter(raw, rel);

  for (const k of REQUIRED) if (!meta[k]) errors.push(`${rel}: front-matter "${k}" is missing`);
  if (meta.topic && !TOPICS.includes(meta.topic)) errors.push(`${rel}: unknown topic "${meta.topic}"`);
  if (meta.source_url && !/^https:\/\//.test(meta.source_url)) errors.push(`${rel}: source_url must be an https URL`);
  if (meta.last_verified) {
    const d = new Date(meta.last_verified);
    if (Number.isNaN(d.getTime())) errors.push(`${rel}: last_verified is not a date (YYYY-MM-DD)`);
    else if ((today - d) / 864e5 > STALE_DAYS) warnings.push(`${rel}: last verified ${meta.last_verified}, older than ${STALE_DAYS} days`);
  }
  if (/<\/?[a-z][^>]*>/i.test(body.replace(/<https?:[^>]+>/g, ''))) errors.push(`${rel}: raw HTML is not allowed in knowledge files`);
  if (INJECTION_RE.test(body)) errors.push(`${rel}: contains instruction-like text aimed at the model`);
  if (HIDDEN_RE.test(raw.replace(/^﻿/, ''))) errors.push(`${rel}: contains hidden Unicode characters`);

  if (meta.visibility !== 'public') {
    warnings.push(`${rel}: visibility is "${meta.visibility}", left out of the public index`);
    continue;
  }

  const secs = sections(body);
  if (secs.length === 0) errors.push(`${rel}: no "## " sections found`);

  for (let si = 0; si < secs.length; si++) {
    const s = secs[si];
    let text = s.lines.join('\n').trim();
    if (!text) continue; // a "## " heading that only groups "### " sub-sections
    const heading = s.path.join(' > ');
    let src = text.match(SOURCE_RE);
    // A "Source:" line at the end of a "## " section also covers the sub-sections above it.
    for (let j = si + 1; !src && j < secs.length && secs[j].path[0] === s.path[0]; j++) {
      src = secs[j].lines.join('\n').match(SOURCE_RE);
    }
    if (!src) {
      errors.push(`${rel} [${heading}]: section does not end with a "Source: <url>" line`);
      continue;
    }
    const sources = src[1].split(/\s*;\s*/).map((u) => u.trim()).filter(Boolean);
    text = text.replace(SOURCE_RE, '').trim();
    if (text.length > MAX_CHUNK_CHARS) warnings.push(`${rel} [${heading}]: ${text.length} characters, consider splitting`);

    const chunk = {
      id: `${slug(rel.replace(/^content\/kb\//, '').replace(/\.md$/, ''))}#${slug(heading)}`,
      file: rel,
      title: meta.title,
      heading,
      topic: meta.topic,
      competition: meta.competition,
      last_verified: meta.last_verified,
      url: sources.find((u) => /^https:\/\//.test(u)) || meta.source_url,
      sources,
      text,
    };
    if (meta.topic === 'faq') faq.push({ id: chunk.id, q: s.path[s.path.length - 1], a: text, url: chunk.url, last_verified: meta.last_verified });
    chunks.push(chunk);
  }
}

const ids = new Set();
for (const c of chunks) {
  if (ids.has(c.id)) errors.push(`duplicate section id ${c.id} (two sections with the same heading in one file)`);
  ids.add(c.id);
}

for (const w of warnings) console.warn(`warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  console.error(`\nKnowledge base build failed: ${errors.length} error(s).`);
  process.exit(1);
}

mkdirSync(dirname(OUT_INDEX), { recursive: true });
writeFileSync(OUT_INDEX, JSON.stringify({ built_at: today.toISOString().slice(0, 10), chunks }, null, 1));
// Hosts of every source the knowledge base cites: links to these may be shown in answers.
const hosts = new Set();
for (const c of chunks)
  for (const u of c.sources) {
    try {
      const url = new URL(u);
      if (url.protocol === 'https:') hosts.add(url.host);
    } catch {}
  }
writeFileSync(join(dirname(OUT_INDEX), 'link-hosts.json'), JSON.stringify(Array.from(hosts).sort(), null, 1));
writeFileSync(OUT_FAQ,JSON.stringify({ built_at: today.toISOString().slice(0, 10), faq }, null, 1));

const chars = chunks.reduce((n, c) => n + c.text.length, 0);
const byTopic = chunks.reduce((m, c) => ({ ...m, [c.topic]: (m[c.topic] || 0) + 1 }), {});
console.log(`Knowledge base: ${chunks.length} sections, about ${Math.round(chars / 4)} tokens, ${faq.length} FAQ entries`);
console.log(`By topic: ${Object.entries(byTopic).map(([k, v]) => `${k} ${v}`).join(', ')}`);

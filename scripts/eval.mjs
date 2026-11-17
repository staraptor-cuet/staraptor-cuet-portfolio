// Runs the question sets in evals/ against a running server and checks each answer.
// Usage:  node scripts/eval.mjs [golden|knowledge|edge|redteam|all] [--base http://localhost:3000] [--only id1,id2] [--delay 4000]
// Start the site first (npm run dev). Each question is sent as a new visitor, one at a time, paced to stay
// inside the Groq requests-per-minute limit. Results are written to evals/results/<set>-<date>.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const which = args[0] && !args[0].startsWith('--') ? args[0] : 'all';
const BASE = flag('base', 'http://localhost:3000');
const ONLY = (flag('only', '') || '').split(',').filter(Boolean);
const DELAY = Number(flag('delay', 4000));

async function ask(q, n) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: BASE,
      // a different visitor per question so the per-visitor limit does not stop the run (local servers only)
      'x-forwarded-for': `10.9.${Math.floor(n / 250)}.${(n % 250) + 1}`,
    },
    body: JSON.stringify({ messages: [{ id: `e${n}`, role: 'user', parts: [{ type: 'text', text: q }] }] }),
  });
  if (!res.ok) return { text: '', mode: `http-${res.status}`, sources: 0, raw: await res.text() };
  let text = '';
  let mode = '';
  let sources = 0;
  for (const line of (await res.text()).split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const payload = line.slice(6).trim();
    if (!payload || payload === '[DONE]') continue;
    try {
      const ev = JSON.parse(payload);
      if (ev.type === 'text-delta') text += ev.delta;
      if (ev.type === 'data-status') mode = ev.data.mode;
      if (ev.type === 'data-sources') sources = ev.data.items.length;
    } catch {}
  }
  // straight quotes, so a test for "can't" also matches the typographic form
  return { text: text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'), mode, sources };
}

function check(t, r) {
  const fails = [];
  const low = r.text.toLowerCase();
  for (const s of t.all || []) if (!low.includes(s.toLowerCase())) fails.push(`missing "${s}"`);
  if (t.any && !t.any.some((s) => low.includes(s.toLowerCase()))) fails.push(`none of ${JSON.stringify(t.any)}`);
  for (const s of t.none || []) if (low.includes(s.toLowerCase())) fails.push(`contains forbidden "${s}"`);
  if (t.regex && !new RegExp(t.regex, 'i').test(r.text)) fails.push(`does not match /${t.regex}/`);
  if (t.cites && !(/\[\d{1,2}\]/.test(r.text) && r.sources > 0)) fails.push('no citation');
  if (t.mode && r.mode !== t.mode) fails.push(`mode ${r.mode}, expected ${t.mode}`);
  if (t.maxChars && r.text.length > t.maxChars) fails.push(`answer ${r.text.length} chars > ${t.maxChars}`);
  if (!r.text) fails.push('empty answer');
  if (/[ঀ-৿]/.test(r.text)) fails.push('reply contains Bangla script (must be English)');
  return fails;
}

const sets = which === 'all' ? ['golden', 'knowledge', 'edge', 'redteam'] : [which];
let n = 0;
let exit = 0;
for (const set of sets) {
  let tests = JSON.parse(readFileSync(join(ROOT, 'evals', `${set}.json`), 'utf8'));
  if (ONLY.length) tests = tests.filter((t) => ONLY.includes(t.id));
  const results = [];
  let pass = 0;
  const modes = {};
  for (const t of tests) {
    const r = await ask(t.q, n++);
    const fails = check(t, r);
    modes[r.mode] = (modes[r.mode] || 0) + 1;
    if (!fails.length) pass++;
    console.log(`${fails.length ? 'FAIL' : 'ok  '} ${set}/${t.id} [${r.mode}]${fails.length ? `  -> ${fails.join('; ')}` : ''}`);
    if (fails.length) console.log(`       answer: ${r.text.slice(0, 220).replace(/\n/g, ' ')}`);
    results.push({ ...t, answer: r.text, mode: r.mode, sources: r.sources, fails });
    if (r.mode === 'ai') await new Promise((ok) => setTimeout(ok, DELAY));
  }
  const pct = tests.length ? Math.round((100 * pass) / tests.length) : 0;
  console.log(`\n${set}: ${pass}/${tests.length} passed (${pct}%). Modes: ${JSON.stringify(modes)}\n`);
  mkdirSync(join(ROOT, 'evals', 'results'), { recursive: true });
  writeFileSync(
    join(ROOT, 'evals', 'results', `${set}-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({ base: BASE, pass, total: tests.length, modes, results }, null, 1),
  );
  const need = set === 'redteam' ? 100 : 90;
  if (pct < need) exit = 1;
}
process.exit(exit);

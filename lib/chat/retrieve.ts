// Keyword retrieval (BM25) over the knowledge index built by scripts/build-kb.mjs.
// No external service: the index is a JSON file bundled with the function.
import kb from './generated/kb-index.json';
import type { KbChunk } from './types';

const CHUNKS = (kb as { chunks: KbChunk[] }).chunks;

const STOP = new Set(
  'a an and are as at be by can do does for from has have how i in is it its me my of on or our that the their them they this to was we what when where which who why will with you your about tell give show please'.split(' '),
);

// Query-side expansion: visitor words -> words used in the knowledge files.
const SYNONYMS: Record<string, string[]> = {
  join: ['recruitment', 'joining'],
  apply: ['recruitment', 'apply'],
  member: ['crew', 'members'],
  members: ['crew'],
  people: ['crew', 'members'],
  leader: ['lead'],
  captain: ['lead', 'project'],
  founder: ['founding', 'lead'],
  drone: ['uav', 'aircraft', 'vtol'],
  plane: ['aircraft'],
  uav: ['aircraft', 'vtol'],
  spec: ['specifications'],
  specs: ['specifications'],
  size: ['wingspan', 'length'],
  heavy: ['weight'],
  weight: ['take', 'off', 'kg'],
  maximum: ['limit', 'below', 'under', 'requirements'],
  max: ['limit', 'below', 'under', 'requirements', 'maximum'],
  limit: ['below', 'maximum', 'requirements'],
  allowed: ['requirements', 'rules', 'eligibility'],
  eligible: ['eligibility', 'apply'],
  eligibility: ['apply', 'who'],
  fast: ['speed', 'cruise'],
  fly: ['flight', 'endurance'],
  battery: ['lipo', 'endurance'],
  money: ['sponsorship', 'prizes', 'budget'],
  fund: ['sponsorship', 'sponsor'],
  funding: ['sponsorship', 'sponsor'],
  donate: ['sponsor', 'sponsorship'],
  partner: ['sponsor', 'partners'],
  cost: ['budget', 'tiers', 'proposal'],
  price: ['tiers', 'proposal'],
  reach: ['contact', 'email'],
  mail: ['email'],
  number: ['phone'],
  call: ['phone'],
  social: ['facebook', 'instagram', 'linkedin'],
  odtu: ['metu'],
  ankara: ['metu'],
  turkey: ['türkiye', 'teknofest', 'metu'],
  turkiye: ['türkiye', 'teknofest', 'metu'],
  rules: ['requirements', 'rules'],
  deadline: ['dates', 'timeline', 'calendar'],
  date: ['dates', 'timeline', 'calendar'],
  when: ['dates', 'timeline'],
  win: ['results', 'prizes'],
  won: ['results'],
  winner: ['results'],
  autopilot: ['pixhawk', 'ardupilot', 'px4', 'flight', 'controller'],
  simulation: ['cfd', 'ansys'],
  material: ['materials', 'carbon', 'pla'],
  hover: ['hover', 'vertical'],
};

// Light stemmer: plural, -ing, -ed and a final -e are removed, so "scored", "scoring" and "scores" all meet "score".
function stem(w: string): string {
  if (/\d/.test(w)) return w;
  if (w.length > 4 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  // "planned" -> "plan", "spinning" -> "spin"
  if (w.length > 3 && /([b-df-hj-np-tv-z])\1$/.test(w) && !/(ll|ss|ff)$/.test(w)) w = w.slice(0, -1);
  return w;
}

// synonym table keyed by stemmed word
const SYN = new Map<string, string[]>();
Object.keys(SYNONYMS).forEach((k) => SYN.set(stem(k), [...(SYN.get(stem(k)) || []), ...SYNONYMS[k]]));

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

interface Doc {
  chunk: KbChunk;
  tf: Map<string, number>;
  len: number;
}

const docs: Doc[] = CHUNKS.map((chunk) => {
  // Heading and title words count three times: a section about "Mission 2" should win for "mission 2".
  const tokens = [
    ...tokenize(chunk.text),
    ...Array(3).fill(tokenize(`${chunk.title} ${chunk.heading}`)).flat(),
  ];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  return { chunk, tf, len: tokens.length };
});

const N = docs.length || 1;
const avgLen = docs.reduce((n, d) => n + d.len, 0) / N;
const df = new Map<string, number>();
for (const d of docs) d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1));

const K1 = 1.4;
const B = 0.7;

export interface Hit {
  chunk: KbChunk;
  score: number;
}

export function detectCompetition(q: string): 'metu-vtol' | 'teknofest' | null {
  const s = q.toLowerCase();
  const metu = /\b(metu|odt[uü]|ankara)\b/.test(s);
  const tek = /te[ck]h?no ?f[ea]st|teknofes\b|t3 foundation/.test(s);
  if (metu && !tek) return 'metu-vtol';
  if (tek && !metu) return 'teknofest';
  return null;
}

/** Edit distance, stopping early once it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

const vocab: string[] = [];
df.forEach((_, t) => {
  if (t.length >= 4 && !/^\d+$/.test(t)) vocab.push(t);
});
const typoCache = new Map<string, string | null>();

/** A misspelt word ("wingspann", "sponser", "teknofst") is mapped to the closest word in the knowledge base. */
function fixTypo(t: string): string | null {
  if (t.length < 5 || df.has(t) || SYNONYMS[t]) return null;
  if (typoCache.has(t)) return typoCache.get(t) ?? null;
  const max = t.length >= 8 ? 2 : 1;
  let best: string | null = null;
  let bestD = max + 1;
  let bestDf = 0;
  for (const v of vocab) {
    if (v[0] !== t[0]) continue; // people rarely get the first letter wrong; this also keeps matches sensible
    const dist = editDistance(t, v, max);
    const freq = df.get(v) || 0;
    if (dist < bestD || (dist === bestD && freq > bestDf)) {
      best = v;
      bestD = dist;
      bestDf = freq;
    }
  }
  const out = bestD <= max ? best : null;
  typoCache.set(t, out);
  return out;
}

/** Share (0 to 1) of the question's content words, after typo correction, that appear in a passage. */
export function matchShare(query: string, chunk: KbChunk): number {
  const words = Array.from(new Set(tokenize(query).map((t) => fixTypo(t) ?? t)));
  if (words.length === 0) return 0;
  const inChunk = new Set(tokenize(`${chunk.title} ${chunk.heading} ${chunk.text}`));
  return words.filter((w) => inChunk.has(w)).length / words.length;
}

export function search(query: string, k = 5): Hit[] {
  const base = tokenize(query);
  const weights = new Map<string, number>();
  for (const t0 of base) {
    const fixed = fixTypo(t0);
    const t = fixed ?? t0;
    if (fixed) weights.set(t, Math.max(weights.get(t) || 0, 0.85));
    else weights.set(t, Math.max(weights.get(t) || 0, 1));
    for (const syn of SYN.get(t) || []) {
      const s = stem(syn);
      weights.set(s, Math.max(weights.get(s) || 0, 0.5));
    }
  }
  if (weights.size === 0) return [];

  const comp = detectCompetition(query);
  // Without a competition word in the question, "the aircraft" means the team's aircraft, not a rulebook.
  const aboutCompetition = comp !== null || /\b(competition|contest|mission|rule|rules|scoring|score|prize|category|categories|edition|festival)\b/i.test(query);
  const aboutEngineering = /\b(how does|how do|what is an?|explain|why|difference between|formula|work|works)\b/i.test(query);
  const hits: Hit[] = [];
  for (const d of docs) {
    // A question that names one competition never gets the other competition's rules.
    if (comp && d.chunk.topic === 'competition' && d.chunk.competition !== comp) continue;
    let score = 0;
    weights.forEach((w, t) => {
      const f = d.tf.get(t);
      if (!f) return;
      const idf = Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
      score += w * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen)));
    });
    if (score <= 0) continue;
    const topic = d.chunk.topic;
    if (topic === 'competition' && !aboutCompetition) score *= 0.45;
    if (topic === 'vtol-engineering' && !aboutEngineering) score *= 0.7;
    if (topic === 'faq') score *= 1.15;
    hits.push({ chunk: d.chunk, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

export function chunkCount(): number {
  return CHUNKS.length;
}

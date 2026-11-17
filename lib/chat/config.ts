// Single place for every tunable value of the Raptor assistant.
// Model IDs and limits checked against console.groq.com/docs on 2026-11-13.
// If Groq renames or retires a model, change it here only.

export const ASSISTANT_NAME = 'Raptor';
export const TEAM_EMAIL = 'staraptorcuet@gmail.com';
export const SITE_URL = 'https://staraptorcuet.vercel.app';
/** Bump when the prompt or answer format changes, so cached answers from the old version are not reused. */
export const CACHE_VERSION = 'v4';

export const MODELS = {
  /**
   * Answer models, tried in order. A model is skipped while it is cooling down after a 429.
   * Checked with the team's key on 2026-11-13: each has its own quota of 1,000 requests/day and
   * 8,000 tokens/minute on the free tier. The Llama models in Groq's docs are not available to free keys.
   */
  answer: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'],
  /** Turns a follow-up or non-English question into a standalone English search query (tried in order). */
  rewrite: ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
  /** Prompt-injection classifier; returns a probability. The guard fails open if the model is unavailable. */
  guard: 'meta-llama/llama-prompt-guard-2-86m',
} as const;

export const LIMITS = {
  maxInputChars: 500,
  maxHistoryTurns: 6, // user+assistant messages sent to the model
  maxHistoryCharsPerMessage: 700,
  maxOutputTokens: 450,
  temperature: 0.2,
  retrievedChunks: 5,
  maxContextChars: 7200, // about 1,800 tokens of retrieved text
  maxChunkChars: 1900,
  /** Per-visitor limits (hashed IP). */
  perMinute: 8,
  perDay: 60,
  /** Whole-site ceiling of LLM answers per UTC day; above it the bot serves FAQ mode. */
  globalPerDay: 2400, // three answer models x 1,000 requests/day, with headroom for rewrite calls
  guardThreshold: 0.9,
  logTtlSeconds: 60 * 60 * 24 * 30,
  cacheTtlSeconds: 60 * 60 * 24 * 7,
} as const;

export type ChatMode = 'ai' | 'faq' | 'off';

/** Kill switch: set CHAT_MODE=faq (no LLM calls) or CHAT_MODE=off in Vercel and redeploy. */
export function chatMode(): ChatMode {
  const m = (process.env.CHAT_MODE || 'ai').toLowerCase();
  return m === 'faq' || m === 'off' ? m : 'ai';
}

/** Hosts whose links may appear in answers. Anything else is shown as plain text. */
export const ALLOWED_LINK_HOSTS = [
  'staraptorcuet.vercel.app',
  'www.linkedin.com',
  'linkedin.com',
  'www.facebook.com',
  'www.instagram.com',
  'drive.google.com',
  'vtol-ae.metu.edu.tr',
  'teknofest.org',
  'www.teknofest.org',
  'cdn.teknofest.org',
  't3vakfi.org',
  'www.t3vakfi.org',
  'ardupilot.org',
  'docs.px4.io',
  'px4.io',
  'pixhawk.org',
  'mavlink.io',
  'qgroundcontrol.com',
  'docs.qgroundcontrol.com',
  'www.grc.nasa.gov',
  'www1.grc.nasa.gov',
  'm-selig.ae.illinois.edu',
  'airfoiltools.com',
  'docs.opencv.org',
  'april.eecs.umich.edu',
  'www.ansys.com',
  'colorfabb.com',
  'www.cuet.ac.bd',
  'caab.gov.bd',
  'www.caab.gov.bd',
  'web.shgm.gov.tr',
];

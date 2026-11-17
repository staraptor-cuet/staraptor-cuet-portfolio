# Raptor runbook

For the person who looks after the assistant. Hand this over when the owner graduates.

## Accounts (all should belong to the team email, with 2-step login and two admins)

| Service | Used for | Where the values go |
|---|---|---|
| Groq (console.groq.com) | the AI model | `GROQ_API_KEYS` |
| Upstash Redis (upstash.com) | rate limits, answer cache, chat logs, feedback | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Vercel | hosting and environment variables | Project > Settings > Environment Variables |

Other variables: `LOG_SALT` (any long random text), `CHAT_MODE` (`ai`, `faq` or `off`). Names and meanings are in
`.env.example`. Never put a key in the code, in chat, or in a variable that starts with `NEXT_PUBLIC_`.

## First-time setup

1. Local: copy `.env.example` to `.env.local` and fill in `GROQ_API_KEYS`. Run `npm run dev`.
2. Vercel: add the same variables for Production and Preview. In Settings > Build, the Output Directory must be the
   default (empty). The site used to be a static export; it now needs the normal Next.js build.
3. Vercel > Firewall: add one rate-limit rule for the path `/api/chat` (for example 20 requests per minute per IP).
4. Open the Groq console > Settings > Limits and compare the limits of the models in `lib/chat/config.ts` with
   `LIMITS.globalPerDay`. Keep the daily ceiling below the requests-per-day limit of the first answer model.

## Switching the assistant off or to FAQ-only

Set `CHAT_MODE=faq` (no AI calls, closest FAQ answer) or `CHAT_MODE=off` in Vercel, then redeploy. Set it back to
`ai` to restore normal service.

## When visitors see "usage limit" answers

The assistant shows FAQ answers when the Groq quota for the day or minute is used up, or when the site-wide daily
ceiling is reached. In testing on 2026-11-13, one free key ran out after roughly 250 AI answers in a day
(approximate count across three models). Fixed replies (greetings, refusals, repeated questions from the cache)
do not use the allowance. Check the Groq console usage page. Options: wait for the reset, lower traffic with the
firewall rule, or move the Groq account to the paid Developer tier. Rotating keys from several personal accounts to
get more free quota is against the intent of Groq's terms and can get accounts suspended.

## Changing a key (each semester, and at once when a member with access leaves or a key leaks)

1. Create a new key in the Groq console. 2. Replace `GROQ_API_KEYS` in Vercel. 3. Redeploy. 4. Delete the old key
in the Groq console. If a key was ever committed to git, treat it as leaked even after removing it.

## If a model is retired

Groq retires models from time to time. Replace the model ID in `MODELS` in `lib/chat/config.ts`, run
`npm run eval` locally, and deploy. The injection guard fails open if its model is missing, so answers keep
working, but replace it soon.

## Logs and privacy

Each question and answer is stored in Upstash for 30 days with a hashed visitor ID (no IP address, no name).
Emails and phone numbers typed by visitors are removed before storage. Keys: `log:YYYY-MM-DD` (conversations) and
`fb:YYYY-MM-DD` (thumbs up/down). To delete everything for a day, delete that key in the Upstash console.

## Bad answer reported

1. Find the entry in `log:<date>` (the feedback entry holds its `logId`).
2. Fix the knowledge file that caused it, or add the missing fact with a source (see `README.md`).
3. Add the question to `evals/golden.json` (or `evals/redteam.json` for an attack) so it stays fixed.
4. Run `npm run eval`, then deploy.

## Regular checks

- Monthly: open the knowledge files with dates and "not announced" lines (competitions, recruitment, sponsors) and
  update `last_verified`. The build warns about files not verified for 120 days.
- When TEKNOFEST or METU publish a new cycle: update `content/kb/teknofest.md` or `content/kb/metu-vtol.md` from
  the official page and specification only.
- After any change to the prompt, models or knowledge: `npm run eval`. Targets: at least 90% on the golden set and
  every red-team case passing.

import { ALLOWED_LINK_HOSTS, SITE_URL } from './config';
// hosts of all sources cited in the knowledge base, written by scripts/build-kb.mjs
import kbHosts from './generated/link-hosts.json';

const SITE_HOST = new URL(SITE_URL).host;
const HOSTS = new Set<string>([...ALLOWED_LINK_HOSTS, ...(kbHosts as string[])]);

/** Only same-site paths, mailto/tel, and https links to allow-listed hosts may be rendered as links. */
export function isAllowedLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (/^mailto:staraptorcuet@gmail\.com/i.test(href)) return true;
  if (/^tel:\+?[\d\s-]+$/.test(href)) return true;
  try {
    const u = new URL(href);
    return u.protocol === 'https:' && HOSTS.has(u.host);
  } catch {
    return false;
  }
}

/** Turns a link to our own site into a relative path so it opens in the same tab; null for other sites. */
export function toSitePath(href: string): string | null {
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  try {
    const u = new URL(href);
    return u.host === SITE_HOST ? `${u.pathname}${u.hash}` || '/' : null;
  } catch {
    return null;
  }
}

// Exact facts (crew, specs, sponsors, contact) come from typed data, never from the model's memory.
// The crew roster is the same file the Crew page renders, so there is one source of truth.
import { members } from '@/app/crew/members';
import specs from '@/content/facts/specs.json';
import sponsors from '@/content/facts/sponsors.json';
import contact from '@/content/facts/contact.json';
import { SITE_URL } from './config';
import type { CrewCardMember, KbChunk, RaptorData } from './types';

const SUBTEAMS = ['design', 'simulation', 'branding', 'communication', 'research', 'software', 'documentation'];

function publicMember(m: (typeof members)[number]): CrewCardMember {
  // Personal emails are deliberately left out: the bot routes contact to the team inbox.
  return { name: m.name, designation: m.designation, batch: m.batch, linkedin: m.linkedin, image: m.image, isLead: m.isLead };
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Members whose name is mentioned in the question (two name words, or one distinctive word of 5+ letters). */
export function matchMembers(query: string): CrewCardMember[] {
  const q = ` ${norm(query)} `;
  const common = new Set(['islam', 'hossain', 'ahmed', 'barua', 'kumar', 'chowdhury', 'khan', 'ayman', 'abrar', 'miftahul']);
  const out: CrewCardMember[] = [];
  const qWords = q.trim().split(' ').filter((w) => w.length >= 5);
  for (const m of members) {
    const words = norm(m.name).split(' ').filter((w) => w.length > 2);
    const hits = words.filter((w) => q.includes(` ${w} `));
    const distinctive = hits.some((w) => w.length >= 5 && !common.has(w));
    // one wrong, missing or extra letter in a distinctive name still matches ("Tahmidul" / "Tahmidull")
    const nearly = words.some((w) => w.length >= 6 && !common.has(w) && qWords.some((x) => x !== w && oneEditApart(w, x)));
    if (hits.length >= 2 || distinctive || (nearly && hits.length >= 1) || (nearly && qWords.length <= 6)) out.push(publicMember(m));
  }
  return out;
}

function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1 || a[0] !== b[0]) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export function membersBySubteam(query: string): CrewCardMember[] {
  const q = norm(query);
  if (/\b(project lead|team lead(er)?|captain|head of the team|who leads|leader of)\b/.test(q) && !SUBTEAMS.some((s) => q.includes(s))) {
    return members.filter((m) => m.designation === 'Project Lead').map(publicMember);
  }
  const sub = SUBTEAMS.find((s) => q.includes(s));
  if (!sub) return [];
  const key = sub === 'communication' ? 'branding' : sub;
  return members.filter((m) => m.designation.toLowerCase().includes(key)).map(publicMember);
}

const CREW_INTENT = /\b(crew|members?|roster|who (is|are) (in|on)|team leads?|leads?|leader|captain|people|students)\b/i;
const SPEC_INTENT = /\b(spec|specs|specification|wingspan|length|weight|payload|endurance|cruise|speed|wing load|airfoil|how (big|heavy|fast|long)|dimension)/i;
const SPONSOR_INTENT = /\b(sponsor|sponsors|sponsorship|sponser|sponcer|spons|partner|partners|proposal|fund|funding|donat|support the team|invest)/i;
const CONTACT_INTENT = /\b(contact|email|e-mail|mail|phone|call|reach|facebook|instagram|linkedin|social|address|where are you|join|recruit|apply|press|media)\b/i;

/** Roster text given to the model when the question is about people (no emails). */
export function rosterChunk(): KbChunk {
  const lines = members.map((m) => `- ${m.name}: ${m.designation}, batch ${m.batch}`);
  return {
    id: 'facts#crew-roster',
    file: 'app/crew/members.ts',
    title: 'Team Staraptor CUET crew',
    heading: 'Crew roster',
    topic: 'team',
    competition: 'none',
    last_verified: (specs as { as_of: string }).as_of,
    url: `${SITE_URL}/crew`,
    sources: [`${SITE_URL}/crew`],
    text:
      `Team Staraptor CUET has ${members.length} crew members. Roster (name: role, batch):\n${lines.join('\n')}\n` +
      'Each member has a LinkedIn link on the Crew page. For contact, use the team email staraptorcuet@gmail.com.',
  };
}

export interface FactSelection {
  extraChunks: KbChunk[];
  cards: { [K in keyof RaptorData]?: RaptorData[K] };
}

/** Decide, without an LLM call, which exact facts and UI cards belong to this question. */
export function selectFacts(query: string): FactSelection {
  const cards: FactSelection['cards'] = {};
  const extraChunks: KbChunk[] = [];

  const named = matchMembers(query);
  const bySub = named.length ? [] : membersBySubteam(query);
  const crewIntent = CREW_INTENT.test(query);
  if (named.length || bySub.length || crewIntent) {
    extraChunks.push(rosterChunk());
    const shown = named.length ? named : bySub.length ? bySub : members.filter((m) => m.isLead).map(publicMember);
    cards.crew = {
      members: shown.slice(0, 10),
      note: !named.length && !bySub.length ? 'Team leads shown. The full crew is on the Crew page.' : undefined,
    };
  }

  // A question that names a competition is about its rules, not about the team's aircraft or partners.
  const competitionQuestion = /\b(metu|odt[uü]|teknofest|technofest|competition|mission|rule|rules|category)\b/i.test(query);

  // "What is wing loading?" asks for a definition, not for the team's numbers.
  const definition =
    /^\s*(what is|what's|what are|define|explain|meaning of)\b/i.test(query) && !/\b(aircraft|staraptor|your|the team|v1|drone|uav|its)\b/i.test(query);

  if (SPEC_INTENT.test(query) && !competitionQuestion && !definition) {
    const s = specs as { aircraft: string; status: string; groups: RaptorData['specs']['groups']; source_url: string; as_of: string };
    cards.specs = { aircraft: s.aircraft, status: s.status, groups: s.groups, url: s.source_url, asOf: s.as_of };
    extraChunks.push({
      id: 'facts#specs',
      file: 'content/facts/specs.json',
      title: s.aircraft,
      heading: 'Published specifications',
      topic: 'aircraft',
      competition: 'none',
      last_verified: s.as_of,
      url: s.source_url,
      sources: [s.source_url],
      text:
        `${s.aircraft} figures published on the team website (${s.status}):\n` +
        s.groups.flatMap((g) => g.items.map((it) => `- ${it.label}: ${it.value}`)).join('\n'),
    });
  }

  if (SPONSOR_INTENT.test(query) && !competitionQuestion) {
    const s = sponsors as { tiers: RaptorData['sponsors']['tiers']; proposal_url: string; contact_email: string; as_of: string; source_url: string };
    cards.sponsors = { tiers: s.tiers, proposalUrl: s.proposal_url, email: s.contact_email, asOf: s.as_of };
    extraChunks.push({
      id: 'facts#sponsors',
      file: 'content/facts/sponsors.json',
      title: 'Sponsors of Team Staraptor CUET',
      heading: 'Current partners by tier',
      topic: 'sponsorship',
      competition: 'none',
      last_verified: s.as_of,
      url: s.source_url,
      sources: [s.source_url],
      text:
        s.tiers.map((t) => `- ${t.tier}: ${t.sponsors.length ? t.sponsors.map((x) => x.name).join(', ') : `open (${t.open_slots} position(s), to be announced)`}`).join('\n') +
        `\nPrices and benefits of the tiers are not published; the team confirms them. Sponsorship contact: ${s.contact_email}. The sponsorship proposal can be downloaded from the Sponsors page.`,
    });
  }

  if (CONTACT_INTENT.test(query) && !cards.crew) {
    const c = contact as RaptorData['contact'];
    cards.contact = { email: c.email, phone: c.phone, address: c.address, links: c.links };
  }

  return { extraChunks, cards };
}

const FOLLOWUPS: Record<string, string[]> = {
  team: ['Who leads the team?', 'What sub-teams does Staraptor have?', 'How can I join the team?'],
  aircraft: ['What are the aircraft specifications?', 'What materials is the aircraft made of?', 'What did the CFD analysis show?'],
  competition: ['What are the three METU VTOL missions?', 'What is TEKNOFEST?', 'Who can enter the TEKNOFEST UAV competition?'],
  sponsorship: ['Who sponsors the team now?', 'How can my company become a sponsor?', 'Where is the sponsorship proposal?'],
  contact: ['How can I join the team?', 'How can I sponsor the team?', 'Where can I follow the team?'],
  'vtol-engineering': ['How does a VTOL transition to forward flight?', 'What is wing loading?', 'What does a flight controller do?'],
  faq: ['What is Team Staraptor CUET?', 'What aircraft is the team building?', 'Which competitions is the team aiming for?'],
  general: ['What are VTOL drones used for?', 'How can a student start learning about UAVs?', 'What is Team Staraptor CUET?'],
};

export function followups(topic: string | undefined, asked: string): string[] {
  const list = FOLLOWUPS[topic || 'faq'] || FOLLOWUPS.faq;
  const a = asked.toLowerCase().trim();
  return list.filter((q) => q.toLowerCase() !== a).slice(0, 3);
}

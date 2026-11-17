import type { UIMessage } from 'ai';

export interface KbChunk {
  id: string;
  file: string;
  title: string;
  heading: string;
  topic: string;
  competition: string;
  last_verified: string;
  url: string;
  sources: string[];
  text: string;
}

export interface SourceRef {
  n: number;
  title: string;
  heading: string;
  url: string;
  lastVerified: string;
}

export interface CrewCardMember {
  name: string;
  designation: string;
  batch: string;
  linkedin: string;
  image: string;
  isLead: boolean;
}

export interface SpecGroup {
  title: string;
  items: { label: string; value: string }[];
}

export interface SponsorTier {
  tier: string;
  sponsors: { name: string; logo: string }[];
  open_slots: number;
}

export type ChatStatus = 'ai' | 'cached' | 'faq' | 'busy' | 'blocked' | 'off';

/** Typed data parts the server attaches to an assistant message. */
export type RaptorData = {
  sources: { items: SourceRef[] };
  crew: { members: CrewCardMember[]; note?: string };
  specs: { aircraft: string; status: string; groups: SpecGroup[]; url: string; asOf: string };
  sponsors: { tiers: SponsorTier[]; proposalUrl: string; email: string; asOf: string };
  contact: { email: string; phone: string; address: string; links: { label: string; url: string }[] };
  followups: { items: string[] };
  status: { mode: ChatStatus; logId?: string };
};

export type RaptorMessage = UIMessage<never, RaptorData>;

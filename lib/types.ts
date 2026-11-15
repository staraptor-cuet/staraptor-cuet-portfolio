export interface StatItem {
  id: string;
  label: string;
  value: string;
  labelFirst?: boolean;
}

export interface GeneralSettings {
  tagline: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  stats: StatItem[];
  proposalUrl: string;
  contactEmail: string;
  contactPhone?: string;
  headquarters?: string;
  socials: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

export interface CrewMember {
  id: string;
  name: string;
  designation: string;
  batch: string;
  email: string;
  linkedin: string;
  image: string;
  isLead: boolean;
}

export interface SponsorItem {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export interface SponsorTier {
  id: string;
  title: string;
  count: number;
  sponsors: SponsorItem[];
}

export interface ProgressItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  date: string;
}

export interface SpecItem {
  id: string;
  label: string;
  value: string;
}

export interface AvionicsItem {
  id: string;
  title: string;
  desc: string;
}

export interface ComponentItem {
  name: string;
  desc: string;
}

export interface AnalysisItem {
  src: string;
  alt: string;
  caption: string;
}

export interface AircraftSpecs {
  classification: string;
  name: string;
  heroImage: string;
  physicalData: SpecItem[];
  performanceData: SpecItem[];
  avionics: AvionicsItem[];
  components: ComponentItem[];
  analyses: AnalysisItem[];
}

export interface RequirementItem {
  title: string;
  description: string;
}

export interface AchievementPost {
  id: string;
  title: string;
  date: string;
  category?: string;
  badge?: string;
  description: string;
  content?: string;
  image?: string;
  author?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface VtolCompetition {
  title: string;
  subtitle: string;
  overviewText: string;
  posterImage: string;
  requirements: RequirementItem[];
}

export interface SiteContent {
  general: GeneralSettings;
  crew: CrewMember[];
  sponsors: SponsorTier[];
  progress: ProgressItem[];
  achievements?: AchievementPost[];
  gallery: GalleryItem[];
  aircraft: AircraftSpecs;
  vtol2026: VtolCompetition;
}


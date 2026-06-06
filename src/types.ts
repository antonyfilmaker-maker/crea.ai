export type Language = 'pt' | 'en' | 'es';

export type ContentType = 'script' | 'caption' | 'storytelling' | 'ideas' | 'carousel';

export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'twitter';

export type Tone = 'professional' | 'funny' | 'interactive' | 'educational' | 'emotional' | 'bold';

export interface GeneratedContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: Platform;
  tone: Tone;
  language: Language;
  prompt: string;
  output: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface AppTranslations {
  title: string;
  subtitle: string;
  createTab: string;
  editorTab: string;
  historyTab: string;
  favoritesTab: string;
  settingsTab: string;
  formType: string;
  formPlatform: string;
  formTone: string;
  formTarget: string;
  formPrompt: string;
  formPromptPlaceholder: string;
  formExtra: string;
  formExtraPlaceholder: string;
  generateBtn: string;
  generating: string;
  historyTitle: string;
  noHistory: string;
  copied: string;
  copyBtn: string;
  deleteBtn: string;
  favoriteBtn: string;
  searchPlaceholder: string;
  metaHeading: string;
  platformPlaceholder: string;
  tonePlaceholder: string;
  typePlaceholder: string;
  types: {
    script: string;
    caption: string;
    storytelling: string;
    ideas: string;
    carousel: string;
  };
  platforms: {
    instagram: string;
    tiktok: string;
    linkedin: string;
    youtube: string;
    twitter: string;
  };
  tones: {
    professional: string;
    funny: string;
    interactive: string;
    educational: string;
    emotional: string;
    bold: string;
  };
  audiences: {
    general: string;
    young: string;
    professionals: string;
    entrepreneurs: string;
    creatives: string;
  };
  audienceLabel: string;
  statsTitle: string;
  statsTotal: string;
  statsFavorites: string;
  statsPlatformPeak: string;
}

export interface TranslationCredit {
  /**
   * Crowdin username, will be used as a fallback for display name as well as
   * generating the fallback Crowdin profile URL if no link is set
   */
  crowdin: string;
  displayName?: string;
  url?: string;
}

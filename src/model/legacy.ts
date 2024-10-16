export interface TranslationCreditV1 {
  /**
   * Crowdin username, will be used as a fallback for display name as well as
   * generating the fallback Crowdin profile URL if no link is set
   */
  crowdinId: number;
  displayName?: string;
  url?: string;
  avatarUrl?: string;
}

export interface LanguageConfigV1 {
  /**
   * Language name in English
   */
  name: string;
  /**
   * Language name in the language itself
   */
  nativeName: string;
  countryCode: string;
  emoji?: string;
  customFlag?: boolean;
  rtl?: boolean;
  momentLocale?: string;
  crowdinLocale?: string;
  percent?: number;
  calendarLabelFormat?: string;
  calendarYearLabelFormat?: string;
  calendarWeekdayFormat?: string;
  weekendDays?: number[];
  firstDayOfWeek?: number;
  blueDay?: number;
  credits?: TranslationCreditV1[];
}

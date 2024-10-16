import { TranslationCreditOverride } from 'src/model/translation-credit-override';

export interface LanguageConfig {
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
  creditOverrides?: Record<string | number, TranslationCreditOverride>;
}

import reportDataJson from 'public/locales/crowdin.json';

export interface ReportUserData {
  username: string;
  fullName?: string;
  avatarUrl: string;
  languages?: string[];
}

export interface TranslationCompletionData {
  translation: number;
  approval: number;
}

export interface IndexedReportData {
  meta: string;
  users: Partial<Record<string, ReportUserData>>;
  progress: Record<string, TranslationCompletionData>;
}

export const reportData: IndexedReportData = reportDataJson;

export const getTranslationCompletionData = (language: string): TranslationCompletionData | null => reportData.progress[language] || null;

export const getTranslationCompletePercent = (value: TranslationCompletionData | null | undefined): number =>
  typeof value !== 'undefined' && value !== null ? value.approval : 0;

export const getIsTranslationComplete = (value: TranslationCompletionData | undefined | null | number): boolean =>
  (typeof value === 'number' ? value : getTranslationCompletePercent(value)) === 100;

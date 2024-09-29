import reportDataJson from 'public/locales/crowdin.json';

export interface ReportUserData {
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

export const getTranslationCompletePercent = (value: TranslationCompletionData | null): number => (value !== null ? value.approval : 0);

export const getIsTranslationComplete = (value: TranslationCompletionData | null | number): boolean =>
  (typeof value === 'number' ? value : getTranslationCompletePercent(value)) === 100;

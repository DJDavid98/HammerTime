import { TranslationCredit } from 'src/model/translation-credit';
import { IndexedReportData, ReportUserData } from 'src/util/crowdin';

export interface NormalizedCredits {
  displayName: string;
  url: string;
  avatarUrl?: string;
}

export const normalizeCredit = (credit: TranslationCredit, reportData?: IndexedReportData): NormalizedCredits => {
  const { crowdinId } = credit;
  let details: ReportUserData | undefined;
  if (crowdinId) {
    details = reportData?.users?.[crowdinId];
    if (!details) {
      console.warn(`Missing crowdin data for user ID ${crowdinId}`);
    }
  }
  const displayName = credit.displayName ?? details?.fullName ?? details?.username;
  if (!displayName) {
    throw new Error(`Display name is required for credit:\n${JSON.stringify(credit)}`);
  }
  let url = credit.url;
  if (!url) {
    if (!details) {
      throw new Error(`URL is required for credit:\n${JSON.stringify(credit)}`);
    }
    url = `https://crowdin.com/profile/${details.username}`;
  }
  return {
    displayName,
    url,
    avatarUrl: credit.avatarUrl ?? details?.avatarUrl,
  };
};

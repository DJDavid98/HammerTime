import { TranslationCredit } from 'src/model/translation-credit';
import { IndexedReportData, ReportUserData } from 'src/util/crowdin';

export interface NormalizedCredits {
  displayName: string;
  url: string;
  avatarUrl?: string;
}

export const normalizeCredit = (credit: TranslationCredit, reportData?: IndexedReportData): NormalizedCredits => {
  const crowdinUsername = credit.crowdin;
  let details: ReportUserData | undefined;
  if (crowdinUsername) {
    details = reportData?.users?.[crowdinUsername];
    if (!details) {
      console.warn(`Missing crowdin data for username ${crowdinUsername}`);
    }
  }
  const displayName = credit.displayName ?? (details?.fullName || crowdinUsername);
  if (!displayName) {
    throw new Error(`Display name is required for credit:\n${JSON.stringify(credit)}`);
  }
  return {
    displayName,
    url: credit.url ?? `https://crowdin.com/profile/${crowdinUsername}`,
    avatarUrl: credit.avatarUrl ?? details?.avatarUrl,
  };
};

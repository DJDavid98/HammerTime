import { TranslationCreditOverride } from 'src/model/translation-credit-override';
import { IndexedReportData, ReportUserData } from 'src/util/crowdin';

export interface NormalizedCredits {
  displayName: string;
  url: string;
  avatarUrl?: string;
}

export const normalizeCredit = (
  crowdinId: string,
  overridesRecord?: Record<string, TranslationCreditOverride>,
  reportData?: IndexedReportData,
): NormalizedCredits => {
  let details: ReportUserData | undefined;
  const overrides = overridesRecord?.[crowdinId];
  if (crowdinId) {
    details = reportData?.users?.[crowdinId];
    if (!details) {
      console.warn(`Missing crowdin data for user ID ${crowdinId}`);
    }
  }
  const displayName = overrides?.displayName ?? details?.fullName ?? details?.username;
  if (!displayName) {
    throw new Error(`Display name is required for credit:\n${JSON.stringify(overrides)}`);
  }
  let url = overrides?.url;
  if (!url) {
    if (!details) {
      throw new Error(`URL is required for credit:\n${JSON.stringify(overrides)}`);
    }
    url = `https://crowdin.com/profile/${details.username}`;
  }
  return {
    displayName,
    url,
    avatarUrl: overrides?.avatarUrl ?? details?.avatarUrl,
  };
};

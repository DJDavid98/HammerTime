import { TranslationCredit } from 'src/model/translation-credit';

export interface NormalizedCredits {
  displayName: string;
  url: string;
}

export const normalizeCredit = (credit: TranslationCredit): NormalizedCredits => ({
  displayName: credit.displayName ?? credit.crowdin,
  url: credit.url ?? `https://crowdin.com/profile/${credit.crowdin}`,
});

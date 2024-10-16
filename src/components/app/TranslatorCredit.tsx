import { Trans, useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getTranslatorIds, normalizeCredit, NormalizedCredits } from 'src/util/translation';
import { TranslationCredits } from 'components/i18n/TranslationCredits';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from 'modules/AppSidebar.module.scss';
import { Flex, Text } from '@mantine/core';
import { reportData } from 'src/util/crowdin';

export const TranslatorCredit: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const currentLocaleConfig = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);
  const currentLocaleReportData = useMemo(
    () => (language in reportData.languages ? reportData.languages[language] : undefined),
    [language],
  );
  const translatorIds = useMemo(
    () => getTranslatorIds(currentLocaleConfig, currentLocaleReportData),
    [currentLocaleConfig, currentLocaleReportData],
  );

  const translationCredits = useMemo(
    () =>
      translatorIds.length === 0
        ? []
        : translatorIds
            .map((crowdinId) => normalizeCredit(crowdinId, currentLocaleConfig?.creditOverrides, reportData))
            .filter((credit): credit is NormalizedCredits => credit !== null)
            .sort((cr1, cr2) => cr1.displayName.localeCompare(cr2.displayName)),
    [currentLocaleConfig?.creditOverrides, translatorIds],
  );

  if (translationCredits.length === 0) return null;

  return (
    <Flex wrap="nowrap">
      <Text mb="sm">
        <FontAwesomeIcon icon="language" className={styles['text-icon']} />
      </Text>
      <Text mb="sm" transform="uppercase">
        <Trans t={t} i18nKey="credits.translationsBy">
          0
          <TranslationCredits credits={translationCredits} />
        </Trans>
      </Text>
    </Flex>
  );
};

import { Trans, useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { normalizeCredit } from 'src/util/translation';
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

  const translationCredits = useMemo(() => {
    if (!currentLocaleReportData?.translatorIds) return null;

    return currentLocaleReportData.translatorIds
      .map((crowdinId) => normalizeCredit(crowdinId, currentLocaleConfig?.creditOverrides, reportData))
      .sort((cr1, cr2) => cr1.displayName.localeCompare(cr2.displayName));
  }, [currentLocaleConfig?.creditOverrides, currentLocaleReportData?.translatorIds]);

  if (!translationCredits) return null;

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

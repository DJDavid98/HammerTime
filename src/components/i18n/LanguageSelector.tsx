import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Group, Popover, rem, Text, useMantineTheme } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { LanguageFlag } from 'components/i18n/LanguageFlag';
import { UnfinishedTranslationsLink } from 'components/i18n/UnfinishedTranslationsLink';
import toPairs from 'lodash/toPairs';
import styles from 'modules/LanguageSelector.module.scss';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDirAttribute } from 'src/util/common';
import { normalizeCredit, NormalizedCredits } from 'src/util/translation';

const flagIconSize = 32;

const TranslationCredits: FC<{ credits: NormalizedCredits[] }> = ({ credits }) => (
  <>
    {credits.map(({ displayName, url }, i) => (
      <Fragment key={i}>
        {i !== 0 ? ', ' : ''}
        <ExternalLink href={url}>{displayName}</ExternalLink>
      </Fragment>
    ))}
  </>
);

export const LanguageSelector: FC = () => {
  const router = useRouter();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const toggleOpened = useCallback(() => {
    setOpened((o) => !o);
  }, []);
  const sortedLanguages = useMemo(() => toPairs(LANGUAGES).sort(([, a], [, b]) => a.nativeName.localeCompare(b.nativeName)), []);

  const currentLanguage = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);

  const languagePercent = currentLanguage?.percent;
  const translationCredits = useMemo(() => {
    if (!currentLanguage?.credits) return null;

    return currentLanguage.credits.map(normalizeCredit).sort((cr1, cr2) => cr1.displayName.localeCompare(cr2.displayName));
  }, [currentLanguage?.credits]);

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
      }}
    >
      <Group>
        <Box sx={{ flex: 1 }}>
          <Group>
            {currentLanguage ? (
              <LanguageFlag language={currentLanguage} size={flagIconSize} />
            ) : (
              <FontAwesomeIcon icon="globe" fontSize={flagIconSize} />
            )}
            <Text weight="bold" size="lg">
              {currentLanguage?.nativeName}
            </Text>
          </Group>
          {translationCredits && (
            <Text size="sm">
              <Trans t={t} i18nKey="credits.translationsBy">
                0
                <TranslationCredits credits={translationCredits} />
              </Trans>
            </Text>
          )}
          {typeof languagePercent === 'number' && <Text color="yellow">{t('credits.incompleteTranslations')}</Text>}
        </Box>
      </Group>
      <Popover opened={opened} onClose={() => setOpened(false)} position="top" withArrow shadow="xl" width="target">
        <Popover.Target>
          <Group mt="sm" sx={{ justifyContent: 'space-between' }}>
            <Button
              variant="subtle"
              size="sm"
              onClick={toggleOpened}
              rightIcon={<FontAwesomeIcon icon={opened ? 'caret-down' : 'caret-up'} />}
              sx={{ flex: 1 }}
            >
              <Text>{t('common:changeLanguage')}</Text>
            </Button>
            {typeof languagePercent === 'number' && (
              <UnfinishedTranslationsLink crowdinLocale={currentLanguage?.crowdinLocale || language} />
            )}
          </Group>
        </Popover.Target>
        <Popover.Dropdown>
          <div className={styles['language-selector']}>
            {sortedLanguages.map(([key, value]) => {
              const isCurrentLanguage = language === key;
              const dropdownItemJsx = (
                <Button
                  key={isCurrentLanguage ? key : undefined}
                  component={isCurrentLanguage ? undefined : ('a' as `button`)}
                  variant="subtle"
                  className={styles.item}
                  dir={getDirAttribute(key as AvailableLanguage)}
                  leftIcon={<LanguageFlag language={value} />}
                  rightIcon={
                    typeof value.percent === 'number' ? (
                      <Text color="yellow">
                        <FontAwesomeIcon icon="life-ring" />
                      </Text>
                    ) : undefined
                  }
                  disabled={isCurrentLanguage}
                >
                  <span className={styles['native-name']}>{value.nativeName}</span>
                </Button>
              );
              if (isCurrentLanguage) {
                return dropdownItemJsx;
              }
              return (
                <Link
                  key={key}
                  href={{
                    pathname: router.pathname,
                    query: router.query,
                  }}
                  locale={key}
                  passHref
                  shallow={false}
                  legacyBehavior
                >
                  {dropdownItemJsx}
                </Link>
              );
            })}
          </div>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
};

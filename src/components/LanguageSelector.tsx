import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Text } from '@mantine/core';
import { LanguageFlag } from 'components/LanguageFlag';
import { UnfinishedTranslationsLink } from 'components/UnfinishedTranslationsLink';
import toPairs from 'lodash/toPairs';
import styles from 'modules/LanguageSelector.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState, VFC } from 'react';
import Flag from 'react-flagkit';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDirAttribute } from 'src/util/common';

export const LanguageSelector: VFC<{ footerItemClass: string }> = ({ footerItemClass }) => {
  const router = useRouter();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [opened, setOpened] = useState(false);
  const sortedLanguages = useMemo(() => toPairs(LANGUAGES).sort(([, a], [, b]) => a.nativeName.localeCompare(b.nativeName)), []);

  const currentLanguage = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);

  const languagePercent = currentLanguage?.percent;

  return (
    <>
      <div className={footerItemClass}>
        <Popover
          opened={opened}
          onClose={() => setOpened(false)}
          target={
            <Button
              variant="subtle"
              size="sm"
              leftIcon={currentLanguage ? <LanguageFlag language={currentLanguage} /> : <FontAwesomeIcon icon="globe" />}
              rightIcon={<FontAwesomeIcon icon={opened ? 'caret-down' : 'caret-up'} />}
              onClick={() => setOpened((o) => !o)}
            >
              {currentLanguage?.nativeName || t('common:changeLanguage')}
            </Button>
          }
          position="top"
          withArrow
          shadow="xl"
        >
          <Text size="sm" className={styles.changeLanguage}>
            <span>{`${t('common:changeLanguage')} `}</span>
          </Text>
          <div className={styles.languageSelector}>
            {sortedLanguages.map(([key, value]) => {
              const isCurrentLanguage = language === key;
              const dropdownItemJsx = (
                <Button
                  key={isCurrentLanguage ? key : undefined}
                  component={isCurrentLanguage ? 'a' : undefined}
                  variant="subtle"
                  className={styles.item}
                  dir={getDirAttribute(key as AvailableLanguage)}
                  leftIcon={<LanguageFlag language={value} />}
                  rightIcon={
                    typeof value.percent === 'number' && (
                      <Text color="orange">
                        <FontAwesomeIcon icon="life-ring" />
                      </Text>
                    )
                  }
                >
                  <span className={styles.nativeName}>{value.nativeName}</span>
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
                    query: router.query
                  }}
                  locale={key}
                  passHref
                  shallow={false}
                >
                  {dropdownItemJsx}
                </Link>
              );
            })}
          </div>
        </Popover>
      </div>
      {typeof languagePercent === 'number' && (
        <>
          <div className={styles.spacer} />
          <div className={footerItemClass}>
            <UnfinishedTranslationsLink percent={languagePercent} crowdinLocale={currentLanguage?.crowdinLocale || language} />
          </div>
        </>
      )}
    </>
  );
};

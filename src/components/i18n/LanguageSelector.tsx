import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Popover, Text } from '@mantine/core';
import { LanguageFlag } from 'components/i18n/LanguageFlag';
import { UnfinishedTranslationsLink } from 'components/i18n/UnfinishedTranslationsLink';
import toPairs from 'lodash/toPairs';
import styles from 'modules/LanguageSelector.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useMemo, useState } from 'react';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDirAttribute } from 'src/util/common';

export const LanguageSelector: FC<{ footerItemClass: string }> = ({ footerItemClass }) => {
  const router = useRouter();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [opened, setOpened] = useState(false);
  const toggleOpened = useCallback(() => {
    setOpened((o) => !o);
  }, []);
  const sortedLanguages = useMemo(() => toPairs(LANGUAGES).sort(([, a], [, b]) => a.nativeName.localeCompare(b.nativeName)), []);

  const currentLanguage = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);

  const languagePercent = currentLanguage?.percent;

  return (
    <>
      <div className={footerItemClass}>
        <Popover opened={opened} onClose={() => setOpened(false)} position="top" withArrow shadow="xl">
          <Popover.Target>
            <Button
              variant="subtle"
              size="sm"
              leftIcon={currentLanguage ? <LanguageFlag language={currentLanguage} /> : <FontAwesomeIcon icon="globe" />}
              rightIcon={<FontAwesomeIcon icon={opened ? 'caret-down' : 'caret-up'} />}
              onClick={toggleOpened}
            >
              {currentLanguage?.nativeName || t('common:changeLanguage')}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm" className={styles['change-language']}>
              <span>{`${t('common:changeLanguage')} `}</span>
              <Badge color="gray">{sortedLanguages.length}</Badge>
            </Text>
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
                      typeof value.percent === 'number' && (
                        <Text color="orange">
                          <FontAwesomeIcon icon="life-ring" />
                        </Text>
                      )
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
                  >
                    {dropdownItemJsx}
                  </Link>
                );
              })}
            </div>
          </Popover.Dropdown>
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

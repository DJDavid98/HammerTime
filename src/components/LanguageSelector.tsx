import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { UnfinishedTranslationsLink } from 'components/UnfinishedTranslationsLink';
import toPairs from 'lodash/toPairs';
import styles from 'modules/LanguageSelector.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import Flag from 'react-flagkit';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDirAttribute } from 'src/util/common';

export const LanguageSelector: VFC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const sortedLanguages = useMemo(() => toPairs(LANGUAGES).sort(([, a], [, b]) => a.nativeName.localeCompare(b.nativeName)), []);

  const currentLanguage = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);

  const languagePercent = currentLanguage?.percent;

  const nativeLangName = useMemo(() => (currentLanguage ? currentLanguage.nativeName : t('common:changeLanguage')), [currentLanguage, t]);

  return (
    <>
      <UncontrolledDropdown className={classNames(className, styles.languageSelector)}>
        <DropdownToggle color="link" className="fw-bold text-decoration-none">
          {currentLanguage ? <Flag country={currentLanguage.countryCode} /> : <FontAwesomeIcon icon="globe" />}
          <span className={styles.currentLangName}>{nativeLangName}</span>
          <FontAwesomeIcon icon="caret-up" />
        </DropdownToggle>
        <DropdownMenu end dark>
          <DropdownItem header className={styles.item}>
            {t('common:changeLanguage')}
          </DropdownItem>
          {sortedLanguages.map(([key, value]) => {
            if (language === key) {
              return null;
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
                <DropdownItem tag="a" className={styles.item} dir={getDirAttribute(key as AvailableLanguage)}>
                  <Flag country={value.countryCode} />
                  <span className={styles.nativeName}>{value.nativeName}</span>
                  {typeof value.percent === 'number' && (
                    <span className="mx-1 text-warning">
                      <FontAwesomeIcon icon="life-ring" />
                    </span>
                  )}
                </DropdownItem>
              </Link>
            );
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
      {typeof languagePercent === 'number' && (
        <UnfinishedTranslationsLink percent={currentLanguage?.percent} crowdinLocale={currentLanguage?.crowdinLocale || language} />
      )}
    </>
  );
};

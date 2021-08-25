import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
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

  const nativeLangName = useMemo(
    () => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage].nativeName : t('common:changeLanguage')),
    [language, t],
  );

  return (
    <UncontrolledDropdown tag="span" className={classNames(className, styles.languageSelector)}>
      <DropdownToggle color="link" caret>
        <FontAwesomeIcon icon="globe" />
        <span className={styles.currentLangName}>{nativeLangName}</span>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem header className={styles.item}>
          {t('common:changeLanguage')}
        </DropdownItem>
        {toPairs(LANGUAGES).map(([key, value]) => {
          const isCurrent = language === key;
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
              <DropdownItem
                tag="a"
                className={classNames(styles.item, { [styles.current]: isCurrent })}
                dir={getDirAttribute(key as AvailableLanguage)}
              >
                <Flag country={value.countryCode} />
                <span className={styles.nativeName}>{value.nativeName}</span>
                <span className={styles.currentLabel}>{isCurrent && t('common:current')}</span>
              </DropdownItem>
            </Link>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

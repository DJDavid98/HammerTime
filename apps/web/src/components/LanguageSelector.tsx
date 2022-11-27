import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LanguageFlag } from './LanguageFlag';
import { UnfinishedTranslationsLink } from './UnfinishedTranslationsLink';
import styles from './LanguageSelector.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AvailableLanguage, LANGUAGES } from '../config';
import { getDirAttribute } from '../util/common';
import { faCaretDown, faCaretUp, faGlobe, faLifeRing } from '@fortawesome/free-solid-svg-icons';

export const LanguageSelector: FC<{ footerItemClass: string }> = ({ footerItemClass }) => {
  const router = useRouter();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [opened, setOpened] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleOpened = useCallback(() => {
    setOpened((o) => !o);
  }, []);
  const sortedLanguages = useMemo(() => Object.entries(LANGUAGES).sort(([, a], [, b]) => a.nativeName.localeCompare(b.nativeName)), []);

  const currentLanguage = useMemo(() => (language in LANGUAGES ? LANGUAGES[language as AvailableLanguage] : undefined), [language]);

  useEffect(() => {
    if (opened) {
      dialogRef.current?.removeAttribute('open');
      dialogRef.current?.showModal();
    }
  }, [opened]);

  const languagePercent = currentLanguage?.percent;

  return (
    <>
      <div className={footerItemClass}>
        <button onClick={toggleOpened}>
          {currentLanguage ? <LanguageFlag language={currentLanguage} /> : <FontAwesomeIcon icon={faGlobe} />}
          {currentLanguage?.nativeName || t('common:changeLanguage')}
          <FontAwesomeIcon icon={opened ? faCaretDown : faCaretUp} />
        </button>
      </div>
      <dialog ref={dialogRef}>
        <div className={styles.changeLanguage}>
          <span>{`${t('common:changeLanguage')} `}</span>
          <span>({sortedLanguages.length})</span>
        </div>
        <div className={styles.languageSelector}>
          {sortedLanguages.map(([key, value]) => {
            const isCurrentLanguage = language === key;
            const itemProps = {
              key: isCurrentLanguage ? key : undefined,
              className: styles.item,
              dir: getDirAttribute(key as AvailableLanguage),
              disabled: isCurrentLanguage,
            };
            const itemChildren = (
              <>
                <LanguageFlag language={value} />
                <span className={styles.nativeName}>{value.nativeName}</span>
                {typeof value.percent === 'number' && <FontAwesomeIcon icon={faLifeRing} />}
              </>
            );
            const dropdownItemJsx = <button {...itemProps}>{itemChildren}</button>;
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
                className={styles.itemLink}
              >
                {dropdownItemJsx}
              </Link>
            );
          })}
        </div>
      </dialog>
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExternalLink } from 'components/ExternalLink';
import { FooterSeparator } from 'components/FooterSeparator';
import { LanguageSelector } from 'components/LanguageSelector';
import { Trans, useTranslation } from 'next-i18next';
import React, { useRef, VFC } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from 'src/config';
import styles from 'modules/AppFooter.module.scss';

const AppFooterComponent: VFC = () => {
  const { t } = useTranslation();

  const viewSourceRef = useRef<HTMLAnchorElement>(null);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerItem}>
        <LanguageSelector />
      </div>
      <FooterSeparator />
      <div className={styles.footerItem}>
        <Trans t={t} i18nKey="common:builtWith">
          0<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>1</ExternalLink>2
        </Trans>
      </div>
      <FooterSeparator />
      <div className={styles.footerItem}>
        <FontAwesomeIcon icon={['fab', 'osi']} />
        <span className="mx-2">{t('common:openSource')}</span>
        <ExternalLink ref={viewSourceRef} href={REPOSITORY_URL}>
          <FontAwesomeIcon icon={['fab', 'github']} />
        </ExternalLink>
        <UncontrolledTooltip target={viewSourceRef} fade={false}>
          {t('common:viewSource')}
        </UncontrolledTooltip>
      </div>
      <FooterSeparator />
      <div className={styles.footerItem}>{t('common:notAffiliated')}</div>
    </footer>
  );
};

export const AppFooter = AppFooterComponent;

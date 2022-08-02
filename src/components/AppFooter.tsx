import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Footer, Tooltip } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { FooterSeparator } from 'components/FooterSeparator';
import { LanguageSelector } from 'components/LanguageSelector';
import styles from 'modules/AppFooter.module.scss';
import { Trans, useTranslation } from 'next-i18next';
import React, { useEffect, useRef, useState, VFC } from 'react';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from 'src/config';

export const AppFooter: VFC = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState<HTMLElement | null>(null);
  const [footerHeight, setFooterHeight] = useState('61px');

  const viewSourceRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!footer) return;

    const updateFooterHeight = () => {
      const currentFooterHeight = footer.getBoundingClientRect().height.toFixed(3);
      setFooterHeight(currentFooterHeight);
    };

    window.addEventListener('resize', updateFooterHeight, false);
    updateFooterHeight();

    return () => window.removeEventListener('resize', updateFooterHeight);
  }, [footer]);

  return (
    <Footer height={footerHeight}>
      <Center component="footer" inline className={styles.footer} ref={setFooter}>
        <LanguageSelector footerItemClass={styles.footerItem} />
        <FooterSeparator />
        <div className={styles.footerItem}>
          <Trans t={t} i18nKey="common:builtWith">
            0<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>1</ExternalLink>2
          </Trans>
        </div>
        <FooterSeparator />
        <div className={styles.footerItem}>
          <FontAwesomeIcon icon={['fab', 'osi']} />
          <span>{` ${t('common:openSource')} `}</span>
          <Tooltip label={t('common:viewSource')}>
            <ExternalLink ref={viewSourceRef} href={REPOSITORY_URL}>
              <FontAwesomeIcon icon={['fab', 'github']} />
            </ExternalLink>
          </Tooltip>
        </div>
        <FooterSeparator />
        <div className={styles.footerItem}>{t('common:notAffiliated')}</div>
      </Center>
    </Footer>
  );
};

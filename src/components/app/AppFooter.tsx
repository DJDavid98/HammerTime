import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Footer } from '@mantine/core';
import { FooterItem } from 'components/app/FooterItem';
import { FooterSeparator } from 'components/app/FooterSeparator';
import { ExternalLink } from 'components/ExternalLink';
import { LanguageSelector } from 'components/i18n/LanguageSelector';
import styles from 'modules/AppFooter.module.scss';
import { Trans, useTranslation } from 'next-i18next';
import React, { FC, useEffect, useState } from 'react';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from 'src/config';

export const AppFooter: FC = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState<HTMLElement | null>(null);
  const [footerHeight, setFooterHeight] = useState('61px');

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
        <LanguageSelector footerItemClass={styles['footer-item']} />
        <FooterSeparator />
        <FooterItem>
          <Trans t={t} i18nKey="common:builtWith">
            0<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>1</ExternalLink>2
          </Trans>
        </FooterItem>
        <FooterSeparator />
        <FooterItem>
          <FontAwesomeIcon icon={['fab', 'osi']} />
          <span>{` ${t('common:openSource')} `}</span>
        </FooterItem>
        <FooterSeparator />
        <FooterItem>
          <ExternalLink href={REPOSITORY_URL}>
            <FontAwesomeIcon icon={['fab', 'github']} />
            &nbsp;
            {t('common:viewSource')}
          </ExternalLink>
        </FooterItem>
        <FooterSeparator />
        <FooterItem>{t('common:notAffiliated')}</FooterItem>
      </Center>
    </Footer>
  );
};

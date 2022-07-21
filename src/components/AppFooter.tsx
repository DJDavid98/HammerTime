import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Tooltip } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { FooterSeparator } from 'components/FooterSeparator';
import { LanguageSelector } from 'components/LanguageSelector';
import styles from 'modules/AppFooter.module.scss';
import { Trans, useTranslation } from 'next-i18next';
import React, { useRef, VFC } from 'react';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from 'src/config';

const AppFooterComponent: VFC = () => {
  const { t } = useTranslation();

  const viewSourceRef = useRef<HTMLAnchorElement>(null);

  return (
    <Center inline className={styles.footer}>
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
  );
};

export const AppFooter = AppFooterComponent;

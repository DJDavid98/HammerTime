import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExternalLink } from './ExternalLink';
import { FooterItem } from './FooterItem';
import { FooterSeparator } from './FooterSeparator';
import { LanguageSelector } from './LanguageSelector';
import styles from './AppFooter.module.scss';
import { Trans, useTranslation } from 'next-i18next';
import React, { FC } from 'react';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from '../config';
import { faGithub, faOsi } from '@fortawesome/free-brands-svg-icons';

export const AppFooter: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <LanguageSelector footerItemClass={styles.footerItem} />
      <FooterSeparator />
      <FooterItem>
        <Trans t={t} i18nKey="common:builtWith">
          0<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>1</ExternalLink>2
        </Trans>
      </FooterItem>
      <FooterSeparator />
      <FooterItem>
        <FontAwesomeIcon icon={faOsi} />
        <span>{` ${t('common:openSource')} `}</span>
      </FooterItem>
      <FooterSeparator />
      <FooterItem>
        <ExternalLink href={REPOSITORY_URL}>
          <FontAwesomeIcon icon={faGithub} />
          &nbsp;
          {t('common:viewSource')}
        </ExternalLink>
      </FooterItem>
      <FooterSeparator />
      <FooterItem>{t('common:notAffiliated')}</FooterItem>
    </footer>
  );
};

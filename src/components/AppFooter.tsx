import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExternalLink } from 'components/ExternalLink';
import { LanguageSelector } from 'components/LanguageSelector';
import { Trans, useTranslation } from 'next-i18next';
import React, { useRef, VFC } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FONTAWESOME_FREE_LICENSE_URL, REPOSITORY_URL } from 'src/config';

const AppFooterComponent: VFC = () => {
  const { t } = useTranslation();

  const viewSourceRef = useRef<HTMLAnchorElement>(null);

  return (
    <footer id="footer">
      <span>
        <LanguageSelector />
      </span>
      <span>
        <Trans t={t} i18nKey="common:builtWith">
          0<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>1</ExternalLink>2
        </Trans>
      </span>
      <span>
        <FontAwesomeIcon icon={['fab', 'osi']} className="mr-2" />
        {t('common:openSource')}
        <ExternalLink ref={viewSourceRef} href={REPOSITORY_URL} className="ml-2">
          <FontAwesomeIcon icon={['fab', 'github']} />
        </ExternalLink>
        <UncontrolledTooltip target={viewSourceRef} fade={false}>
          {t('common:viewSource')}
        </UncontrolledTooltip>
      </span>
      <span>{t('common:notAffiliated')}</span>
    </footer>
  );
};

export const AppFooter = AppFooterComponent;

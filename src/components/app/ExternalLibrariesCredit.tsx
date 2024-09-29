import { FC } from 'react';
import { ExternalLink } from 'components/ExternalLink';
import { FONTAWESOME_FREE_LICENSE_URL, MANTINE_URL } from 'src/config';
import styles from 'modules/ExternalLibrariesCredit.module.scss';
import { useTranslation } from 'next-i18next';

export const ExternalLibrariesCredit: FC = () => {
  const { t } = useTranslation();
  return (
    <ul className={styles['external-libraries-credit']}>
      <li>
        <ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>{t('credits.fontAwesomeFree')}</ExternalLink>
      </li>
      <li>
        <ExternalLink href={MANTINE_URL}>{t('credits.mantine')}</ExternalLink>
      </li>
    </ul>
  );
};

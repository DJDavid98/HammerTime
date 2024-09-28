import { FC } from 'react';
import { ExternalLink } from 'components/ExternalLink';
import { FONTAWESOME_FREE_LICENSE_URL, MANTINE_URL } from 'src/config';
import styles from 'modules/ExternalLibrariesCredit.module.scss';

export const ExternalLibrariesCredit: FC = () => (
  <ul className={styles['external-libraries-credit']}>
    <li>
      <ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>Font Awesome Free</ExternalLink>
    </li>
    <li>
      <ExternalLink href={MANTINE_URL}>Mantine</ExternalLink>
    </li>
  </ul>
);

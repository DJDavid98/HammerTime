import styles from './AppFooter.module.scss';
import React, { FC, memo } from 'react';

const Separator: FC = () => (
  <span className={styles.footerSeparator} role="presentation">
    {' '}
  </span>
);

export const FooterSeparator = memo(Separator);

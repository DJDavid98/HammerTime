import styles from 'modules/AppFooter.module.scss';
import React, { FC, memo } from 'react';

const Separator: FC = () => (
  <span className={styles['footer-separator']} role="presentation">
    {' '}
  </span>
);

export const FooterSeparator = memo(Separator);

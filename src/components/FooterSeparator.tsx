import React, { memo, VFC } from 'react';
import styles from 'modules/AppFooter.module.scss';

const Separator: VFC = () => (
  <span className={styles.footerSeparator} role="presentation">
    {' '}
  </span>
);

export const FooterSeparator = memo(Separator);

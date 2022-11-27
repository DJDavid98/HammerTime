import styles from './AppFooter.module.scss';
import React, { FC, memo, PropsWithChildren } from 'react';

const Item: FC<PropsWithChildren> = ({ children }) => <div className={styles.footerItem}>{children}</div>;

export const FooterItem = memo(Item);

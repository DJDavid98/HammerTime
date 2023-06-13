import styles from 'modules/AppFooter.module.scss';
import { FC, memo, PropsWithChildren } from 'react';

const Item: FC<PropsWithChildren> = ({ children }) => <div className={styles['footer-item']}>{children}</div>;

export const FooterItem = memo(Item);

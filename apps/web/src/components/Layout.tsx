import { FunctionComponent, PropsWithChildren } from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  header?: JSX.Element;
  notice?: JSX.Element;
  Footer?: FunctionComponent<{ className: string; itemClassName: string; separatorClassName: string }>;
}

export const Layout: FunctionComponent<PropsWithChildren<LayoutProps>> = ({ header, notice, children, Footer }) => {
  // Keep separate return for now
  return (
    <div className={styles.layout}>
      <header>{header}</header>
      {notice}
      <main>{children}</main>
      {Footer && <Footer className={styles.footer} itemClassName={styles.footerItem} separatorClassName={styles.footerSeparator} />}
    </div>
  );
};

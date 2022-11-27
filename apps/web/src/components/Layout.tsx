import { FunctionComponent, PropsWithChildren } from 'react';
import styles from './Layout.module.scss';
import { ProgressIndicator } from './ProgressIndicator';
import { AppFooter } from './AppFooter';

interface LayoutProps {
  header?: JSX.Element;
  notice?: JSX.Element;
  Footer?: FunctionComponent<{ className: string; itemClassName: string; separatorClassName: string }>;
}

export const Layout: FunctionComponent<PropsWithChildren<LayoutProps>> = ({ header, notice, children }) => {
  // Keep separate return for now
  return (
    <>
      <ProgressIndicator />
      <div className={styles.layout}>
        <header>{header}</header>
        {notice}
        <main>{children}</main>
        <AppFooter />
      </div>
    </>
  );
};

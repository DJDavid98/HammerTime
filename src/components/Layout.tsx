import { AppFooter } from 'components/AppFooter';
import { ProgressIndicator } from 'components/ProgressIndicator';
import { FC, memo } from 'react';

const LayoutComponent: FC = ({ children }) => (
  <>
    <ProgressIndicator />
    <div id="wrap">{children}</div>
    <AppFooter />
  </>
);

export const Layout = memo(LayoutComponent) as typeof LayoutComponent;

import { ProgressIndicator } from 'components/ProgressIndicator';
import { FC, memo } from 'react';

const LayoutComponent: FC = ({ children }) => (
  <>
    <ProgressIndicator />
    <div id="wrap">{children}</div>
  </>
);

export const Layout = memo(LayoutComponent) as typeof LayoutComponent;

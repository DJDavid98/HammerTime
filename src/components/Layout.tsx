import { ProgressIndicator } from 'components/ProgressIndicator';
import { FC, memo, PropsWithChildren } from 'react';

const LayoutComponent: FC<PropsWithChildren> = ({ children }) => (
  <>
    <ProgressIndicator />
    <div id="wrap">{children}</div>
  </>
);

export const Layout = memo(LayoutComponent) as typeof LayoutComponent;

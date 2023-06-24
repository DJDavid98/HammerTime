import { AppLoadingOverlay } from 'components/AppLoadingOverlay';
import { LocalSettingsProvider } from 'components/contexts/LocalSettingsProvider';
import { FC, memo, PropsWithChildren } from 'react';

const LayoutComponent: FC<PropsWithChildren> = ({ children }) => (
  <LocalSettingsProvider>
    <AppLoadingOverlay />
    <div id="wrap">{children}</div>
  </LocalSettingsProvider>
);

export const Layout = memo(LayoutComponent);

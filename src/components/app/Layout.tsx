import { FC, memo, PropsWithChildren } from 'react';

const LayoutComponent: FC<PropsWithChildren> = ({ children }) => <div id="wrap">{children}</div>;

export const Layout = memo(LayoutComponent);

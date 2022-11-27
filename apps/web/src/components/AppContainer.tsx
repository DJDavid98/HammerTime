import { CustomIcon } from './CustomIcon';
import styles from './AppContainer.module.scss';
import Link from 'next/link';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import { SITE_TITLE } from '../config';

const headerHeight = 52;

const headerStyles: CSSProperties = {
  height: headerHeight,
};
const shellStyles: CSSProperties = {
  paddingTop: headerHeight,
};

export const AppContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.shell} style={shellStyles}>
    <header className={styles.header} style={headerStyles}>
      <Link href="/" passHref>
        <CustomIcon src="/logos/app.svg" alt="" />
        {` ${SITE_TITLE}`}
      </Link>
    </header>
    <div className={styles.shellContents}>{children}</div>
  </div>
);

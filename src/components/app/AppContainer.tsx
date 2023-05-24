import { Anchor, AppShell, Center, Header } from '@mantine/core';
import { AppFooter } from 'components/app/AppFooter';
import { CustomIcon } from 'components/CustomIcon';
import styles from 'modules/AppContainer.module.scss';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { SITE_TITLE } from 'src/config';

const headerHeight = 52;

const shellStyles = {
  main: {
    marginTop: headerHeight,
  },
};

export const AppContainer: FC<PropsWithChildren> = ({ children }) => (
  <AppShell
    padding="md"
    header={
      <Header fixed height={headerHeight} p="xs">
        <Center>
          <Link href="/" passHref legacyBehavior>
            <Anchor size="xl" weight={700} color="dimmed" underline={false}>
              <CustomIcon src="/logos/app.svg" alt="" />
              {` ${SITE_TITLE}`}
            </Anchor>
          </Link>
        </Center>
      </Header>
    }
    className={styles.shell}
    footer={<AppFooter />}
    fixed={false}
    styles={shellStyles}
  >
    <div className={styles['shell-contents']}>{children}</div>
  </AppShell>
);

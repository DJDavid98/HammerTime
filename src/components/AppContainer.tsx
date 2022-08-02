import { Anchor, AppShell, Center, Header } from '@mantine/core';
import { AppFooter } from 'components/AppFooter';
import { CustomIcon } from 'components/CustomIcon';
import styles from 'modules/AppContainer.module.scss';
import Link from 'next/link';
import { FC } from 'react';
import { SITE_TITLE } from 'src/config';

const headerHeight = 52;

export const AppContainer: FC = ({ children }) => (
  <AppShell
    padding="md"
    header={
      <Header fixed height={headerHeight} p="xs">
        <Center>
          <Link href="/" passHref>
            <Anchor size="xl" weight={700} color="dimmed" underline={false}>
              <CustomIcon src="/logos/app.svg" alt="" />
              {` ${SITE_TITLE}`}
            </Anchor>
          </Link>
        </Center>
      </Header>
    }
    footer={<AppFooter />}
    fixed={false}
    styles={(theme) => ({
      main: {
        backgroundColor: theme.colors.discord[0],
        marginTop: headerHeight,
      },
    })}
  >
    <div className={styles.shellContents}>{children}</div>
  </AppShell>
);

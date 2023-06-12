import { Anchor, AppShell, Burger, Center, Header, MediaQuery, useMantineTheme } from '@mantine/core';
import { AppSidebar } from 'components/app/AppSidebar';
import { LocalSettingsProvider } from 'components/contexts/LocalSettingsProvider';
import { CustomIcon } from 'components/CustomIcon';
import styles from 'modules/AppContainer.module.scss';
import Link from 'next/link';
import { FC, PropsWithChildren, useState } from 'react';
import { SITE_TITLE } from 'src/config';

export const AppContainer: FC<PropsWithChildren> = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <LocalSettingsProvider>
      <AppShell
        padding="md"
        header={
          <Header fixed height={52} p="xs">
            <MediaQuery largerThan="md" styles={{ display: 'none' }}>
              <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" color={theme.colors.gray[6]} pos="absolute" />
            </MediaQuery>
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
        navbar={<AppSidebar opened={opened} />}
        className={styles.shell}
        fixed
      >
        <div className={styles['shell-contents']}>{children}</div>
      </AppShell>
    </LocalSettingsProvider>
  );
};

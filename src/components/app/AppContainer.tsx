import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, AppShell, Aside, Burger, Center, Header, MediaQuery, Navbar, UnstyledButton, useMantineTheme } from '@mantine/core';
import { AppSidebar } from 'components/app/AppSidebar';
import { useLocalSettings } from 'components/contexts/LocalSettingsProvider';
import { CustomIcon } from 'components/CustomIcon';
import styles from 'modules/AppContainer.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { SITE_TITLE } from 'src/config';

const headerHeight = 52;
const toggleButtonSpacing = 8;

export const AppContainer: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { sidebarOnRight, toggleSidebarOnRight } = useLocalSettings();
  const [opened, setOpened] = useState(false);
  const toggleOpen = useCallback(() => setOpened((o) => !o), []);
  const effectiveSidebarOnRight = theme.dir === 'rtl' ? !sidebarOnRight : sidebarOnRight;
  return (
    <AppShell
      padding="md"
      header={
        <Header fixed height={headerHeight} p="xs">
          <MediaQuery largerThan="md" styles={{ display: 'none' }}>
            <Burger opened={opened} onClick={toggleOpen} size="sm" color={theme.colors.gray[6]} pos="absolute" />
          </MediaQuery>
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <UnstyledButton
              pos="absolute"
              top={toggleButtonSpacing}
              left={sidebarOnRight ? toggleButtonSpacing : undefined}
              right={sidebarOnRight ? undefined : toggleButtonSpacing}
              p="xs"
              onClick={toggleSidebarOnRight}
              aria-label={t('toggleSidebarPosition')}
            >
              <FontAwesomeIcon icon={effectiveSidebarOnRight ? 'chevron-left' : 'chevron-right'} fixedWidth />
            </UnstyledButton>
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
      aside={sidebarOnRight ? <AppSidebar opened={opened} Component={Aside} /> : undefined}
      navbar={sidebarOnRight ? undefined : <AppSidebar opened={opened} Component={Navbar} />}
      className={styles.shell}
      fixed
    >
      <div className={styles['shell-contents']}>{children}</div>
    </AppShell>
  );
};

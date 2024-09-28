import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Aside, Navbar, ScrollArea, Space, Text, Title } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { LanguageSelector } from 'components/i18n/LanguageSelector';
import { InputSettings } from 'components/InputSettings';
import { Trans, useTranslation } from 'next-i18next';
import { FC } from 'react';
import { REPOSITORY_URL } from 'src/config';
import { DeveloperCredit } from 'components/app/DeveloperCredit';
import { ExternalLibrariesCredit } from 'components/app/ExternalLibrariesCredit';
import { TranslatorCredit } from 'components/app/TranslatorCredit';
import styles from 'modules/AppSidebar.module.scss';

export const AppSidebar: FC<{ opened: boolean; Component: typeof Aside | typeof Navbar }> = ({ opened, Component }) => {
  const { t } = useTranslation();
  return (
    <Component
      p="md"
      hiddenBreakpoint="md"
      hidden={!opened}
      width={{
        md: 300,
        xl: 400,
      }}
    >
      <Component.Section grow component={ScrollArea} mx="-xs" px="xs" pb="md">
        <Title align="center" order={3} mb={10}>
          <FontAwesomeIcon icon="cog" /> {t('input.settings.label')}
        </Title>

        <InputSettings />
        <Space h="md" />
        <Title align="center" order={3} mb={10}>
          <FontAwesomeIcon icon="info" fixedWidth /> {t('credits.title')}
        </Title>
        <Text mb="sm" transform="uppercase">
          <FontAwesomeIcon icon="user" className={styles['text-icon']} />
          <Trans t={t} i18nKey="credits.developedBy">
            0
            <DeveloperCredit />
          </Trans>
        </Text>
        <Text mb="sm" transform="uppercase">
          <FontAwesomeIcon icon="code" className={styles['text-icon']} />
          <Trans t={t} i18nKey="credits.externalLibraries">
            0
            <ExternalLibrariesCredit />
          </Trans>
        </Text>
        <TranslatorCredit />
        <Text mb="sm" color="#3da639" transform="uppercase">
          <FontAwesomeIcon icon={['fab', 'osi']} className={styles['text-icon']} />
          {t('credits.openSource')}
        </Text>
        <Text mb="sm" transform="uppercase">
          <ExternalLink href={REPOSITORY_URL}>
            <FontAwesomeIcon icon={['fab', 'github']} className={styles['text-icon']} />
            {t('common:viewSource')}
          </ExternalLink>
        </Text>
        <Text size="sm">
          <FontAwesomeIcon icon="ban" className={styles['text-icon']} />
          {t('notAffiliated')}
        </Text>
      </Component.Section>
      <Component.Section>
        <LanguageSelector />
      </Component.Section>
    </Component>
  );
};

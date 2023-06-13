import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Aside, Navbar, ScrollArea, Space, Text, Title } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { LanguageSelector } from 'components/i18n/LanguageSelector';
import { InputSettings } from 'components/InputSettings';
import { Trans, useTranslation } from 'next-i18next';
import React, { FC } from 'react';
import { DEVELOPER_NAME, DEVELOPER_URL, FONTAWESOME_FREE_LICENSE_URL, MANTINE_URL, REPOSITORY_URL } from 'src/config';

const creditsIntoValues = { developerName: DEVELOPER_NAME };

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
        <Text mb="sm">
          <Trans t={t} i18nKey="credits.intro" values={creditsIntoValues}>
            0<ExternalLink href={DEVELOPER_URL}>1</ExternalLink>2<ExternalLink href={FONTAWESOME_FREE_LICENSE_URL}>3</ExternalLink>4
            <ExternalLink href={MANTINE_URL}>5</ExternalLink>6
          </Trans>
        </Text>
        <Text mb="sm">
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          {t('notAffiliated')}
        </Text>
        <Text>
          <ExternalLink href={REPOSITORY_URL}>
            <FontAwesomeIcon icon={['fab', 'github']} />
            &nbsp;
            {t('common:viewSource')}
          </ExternalLink>
        </Text>
      </Component.Section>
      <Component.Section>
        <LanguageSelector />
      </Component.Section>
    </Component>
  );
};

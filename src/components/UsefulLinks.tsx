import { Card, Group, Text } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { TFunction } from 'i18next';
import styles from 'modules/UsefulLinks.module.scss';
import { Trans } from 'next-i18next';
import Image, { StaticImageData } from 'next/image';
import React, { FC, memo, ReactNode } from 'react';
import bot from '../../public/bot.png';
import server from '../../public/server.png';
import textColor from '../../public/textcolor.png';

interface UsefulLink {
  href: string;
  image: StaticImageData;
  name: ReactNode;
  desc: ReactNode;
}

const UsefulLinksComponent: FC<{ t: TFunction; leadText: string }> = ({ t, leadText }) => {
  const components: UsefulLink[] = [
    {
      href: '/discord',
      image: server,
      name: t('common:usefulLinks.server.header'),
      desc: t('common:usefulLinks.server.p'),
    },
    {
      href: '/add-bot',
      image: bot,
      name: t('common:usefulLinks.bot.header'),
      desc: (
        <Trans t={t} i18nKey="common:usefulLinks.bot.pWithoutCommand">
          0<code dir="ltr">1</code>
        </Trans>
      ),
    },
    {
      href: 'https://rebane2001.com/discord-colored-text-generator/',
      image: textColor,
      name: (
        <Trans t={t} i18nKey="common:usefulLinks.textColor.header">
          0<span style={{ color: '#7781ee' }}>1</span>2
        </Trans>
      ),
      desc: t('common:usefulLinks.textColor.p'),
    },
  ];

  return (
    <>
      <Text className={styles['lead-text']}>{leadText}</Text>
      <Group position="center" align="stretch">
        {components.map(({ href, image, name, desc }) => (
          <div key={href} className={styles.link}>
            <Card component={ExternalLink} href={href} shadow="sm" p="lg" withBorder>
              <Card.Section className={styles['card-top-half']}>
                <Image src={image} alt="" fill />
              </Card.Section>

              <div className={styles['card-bottom-half']}>
                <Text className={styles['link-name']}>{name}</Text>

                <Text size="sm" className={styles['link-desc']}>
                  {desc}
                </Text>
              </div>
            </Card>
          </div>
        ))}
      </Group>
    </>
  );
};

export const UsefulLinks = memo(UsefulLinksComponent);

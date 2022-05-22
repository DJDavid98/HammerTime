import { AppContainer } from 'components/AppContainer';
import styles from 'modules/UsefulLinks.module.scss';
import { Trans } from 'next-i18next';
import Image from 'next/image';
import React, { memo, ReactChild, VFC } from 'react';
import { TFunction } from 'react-i18next';
import { Badge, Col, Row } from 'reactstrap';
import bot from '../../public/bot.png';
import server from '../../public/server.png';
import textColor from '../../public/textcolor.png';

interface UsefulLink {
  href: string;
  image: StaticImageData;
  name: ReactChild;
  desc: ReactChild;
}

const UsefulLinksComponent: VFC<{ t: TFunction; leadText: string }> = ({ t, leadText }) => {
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
      name: (
        <Trans t={t} i18nKey="common:usefulLinks.bot.header">
          0
          <Badge color="discord" variant="filled">
            1
          </Badge>
        </Trans>
      ),
      desc: (
        <Trans t={t} i18nKey="common:usefulLinks.bot.p">
          0<code>/timestamp</code>
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
    <AppContainer>
      <p className={styles.leadText}>{leadText}</p>
      <Row className={styles.links}>
        {components.map(({ href, image, name, desc }) => (
          <Col key={href} xs="auto" className={styles.link}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <figure>
                <div className={styles.cardTopHalf}>
                  <Image src={image} />
                </div>
                <figcaption className={styles.cardBottomHalf}>
                  <header className={styles.linkName}>{name}</header>
                  <p className={styles.linkDesc}>{desc}</p>
                </figcaption>
              </figure>
            </a>
          </Col>
        ))}
      </Row>
    </AppContainer>
  );
};

export const UsefulLinks = memo(UsefulLinksComponent);

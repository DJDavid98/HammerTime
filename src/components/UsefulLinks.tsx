import { AppContainer } from 'components/AppContainer';
import styles from 'modules/UsefulLinks.module.scss';
import { Trans } from 'next-i18next';
import Image from 'next/image';
import React, { VFC } from 'react';
import { TFunction } from 'react-i18next';
import { Badge, Col, Row } from 'reactstrap';
import bot from '../../public/bot.png';
import textColor from '../../public/textcolor.png';
import server from '../../public/server.png';

export const UsefulLinks: VFC<{ t: TFunction; leadText: string }> = ({ t, leadText }) => (
  <AppContainer>
    <p className="text-center">{leadText}</p>
    <Row className={styles.links}>
      <Col xs="auto" className={styles.link}>
        <a href="/discord" target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption className={styles.linkName}>
              <header>{t('common:usefulLinks.server.header')}</header>
              <p>{t('common:usefulLinks.server.p')}</p>
            </figcaption>
            <Image src={server} />
          </figure>
        </a>
      </Col>
      <Col xs="auto" className={styles.link}>
        <a href="/add-bot" target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption className={styles.linkName}>
              <header>
                <Trans t={t} i18nKey="common:usefulLinks.bot.header">
                  0<Badge color="discord">1</Badge>
                </Trans>
              </header>
              <p>
                <Trans t={t} i18nKey="common:usefulLinks.bot.p">
                  0<code>/timestamp</code>
                </Trans>
              </p>
            </figcaption>
            <Image src={bot} />
          </figure>
        </a>
      </Col>
      <Col xs="auto" className={styles.link}>
        <a href="https://rebane2001.com/discord-colored-text-generator/" target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption className={styles.linkName}>
              <header>
                <Trans t={t} i18nKey="common:usefulLinks.textColor.header">
                  0<span style={{ color: '#7781ee' }}>1</span>2
                </Trans>
              </header>
              <p>{t('common:usefulLinks.textColor.p')}</p>
            </figcaption>
            <Image src={textColor} />
          </figure>
        </a>
      </Col>
    </Row>
  </AppContainer>
);

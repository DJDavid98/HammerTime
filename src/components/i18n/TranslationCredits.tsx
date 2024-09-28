import { FC, Fragment } from 'react';
import { NormalizedCredits } from 'src/util/translation';
import { ExternalLink } from 'components/ExternalLink';
import styles from 'modules/LanguageSelector.module.scss';
import { Avatar, Text } from '@mantine/core';

export const TranslationCredits: FC<{ credits: NormalizedCredits[] }> = ({ credits }) => (
  <div className={styles.translator}>
    {credits.map(({ displayName, url, avatarUrl }, i) => (
      <Fragment key={i}>
        <ExternalLink href={url} className={styles['translator-item']}>
          <Avatar src={avatarUrl} className={styles['translator-avatar']} size={18} radius="xl" />
          <Text transform="none">{displayName}</Text>
        </ExternalLink>
      </Fragment>
    ))}
  </div>
);

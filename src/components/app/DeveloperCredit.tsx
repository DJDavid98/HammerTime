import { FC } from 'react';
import { ExternalLink } from 'components/ExternalLink';
import { DEVELOPER_AVATAR_URL, DEVELOPER_NAME, DEVELOPER_URL } from 'src/config';
import styles from 'modules/DeveloperCredit.module.scss';
import { Avatar, Text } from '@mantine/core';

export const DeveloperCredit: FC = () => (
  <ExternalLink href={DEVELOPER_URL} className={styles['developer-credit']}>
    <Avatar src={DEVELOPER_AVATAR_URL} size={24} radius="xl" className={styles['developer-avatar']} />
    <Text size="xl">{DEVELOPER_NAME}</Text>
  </ExternalLink>
);

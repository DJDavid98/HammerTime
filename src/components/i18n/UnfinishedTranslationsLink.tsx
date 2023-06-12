import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mantine/core';
import { ExternalLink } from 'components/ExternalLink';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { CROWDIN_URL } from 'src/config';

export const UnfinishedTranslationsLink: FC<{ crowdinLocale: string }> = ({ crowdinLocale }) => {
  const { t } = useTranslation();
  return (
    <Button
      color="yellow"
      variant="subtle"
      size="sm"
      component={ExternalLink}
      href={`${CROWDIN_URL}/${crowdinLocale}`}
      aria-label={t('credits.contributeTranslations')}
      sx={{ flex: 0 }}
    >
      <FontAwesomeIcon icon="life-ring" />
    </Button>
  );
};

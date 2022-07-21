import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@mantine/core';
import { Layout } from 'components/Layout';
import { AppContainer } from 'components/AppContainer';
import { GetStaticProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { VFC } from 'react';
import { typedServerSideTranslations } from 'src/util/i18n-server';

const NotFoundPage: VFC = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <AppContainer>
        <Alert color="orange" icon={<FontAwesomeIcon icon="exclamation-triangle" />} title={t('common:notFound.heading')}>
          {t('common:notFound.content')}
        </Alert>
      </AppContainer>
    </Layout>
  );
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => ({
  props: {
    ...(await typedServerSideTranslations(locale)),
  },
});

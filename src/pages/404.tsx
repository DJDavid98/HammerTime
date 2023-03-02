import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@mantine/core';
import { AppContainer } from 'components/app/AppContainer';
import { Layout } from 'components/app/Layout';
import { GetStaticProps, NextPage } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { typedServerSideTranslations } from 'src/util/i18n-server';

const NotFoundPage: NextPage = () => {
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

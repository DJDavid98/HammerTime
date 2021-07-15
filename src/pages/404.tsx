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
      <AppContainer bg="warning" heading={t('common:notFound.heading')}>
        {t('common:notFound.content')}
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

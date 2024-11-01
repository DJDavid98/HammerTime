import { GetStaticProps, NextPage } from 'next';
import { Layout } from 'components/app/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSquarePlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { SSRConfig, useTranslation } from 'next-i18next';
import { typedServerSideTranslations } from 'src/util/i18n-server';
import styles from 'modules/AddAppPage.module.scss';
import { Center, Flex } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SITE_TITLE } from 'src/config';
import { CustomIcon } from 'components/CustomIcon';
import Head from 'next/head';

interface AddLinkProps extends PropsWithChildren {
  installType: 'user' | 'guild';
  startIcon: IconProp;
  title: string;
  description: string;
}

const AddLink: FC<AddLinkProps> = ({ installType, startIcon, title, description }) => (
  <a href={`/add-bot/${installType}`} className={styles['add-link']}>
    <FontAwesomeIcon icon={startIcon} className={`me-2 ${styles['add-link-icon']}`} />
    <div className={styles['add-link-text']}>
      <h2 className={styles['add-link-title']}>{title}</h2>
      <p className={styles['add-link-description']}>{description}</p>
    </div>
    <FontAwesomeIcon icon={faChevronRight} className={`ms-2 ${styles['add-link-icon']}`} />
  </a>
);

const DiscordAppPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Head>
        <title>{t('common:usefulLinks.bot.header')}</title>
      </Head>

      <Center w="100%" mih="100vh" className={styles.page}>
        <Flex direction="column" align="center">
          <CustomIcon src="/logos/logo.png" alt="" className={styles.logo} />
          <h1 className={styles.title}>{SITE_TITLE}</h1>
          <p className={styles.subtitle}>{t('common:add-app.title')}</p>
          <Flex direction="column" className={styles['add-links-wrap']}>
            <AddLink
              installType="user"
              startIcon={faUserPlus}
              title={t('common:add-app.user.title')}
              description={t('common:add-app.user.description')}
            />
            <AddLink
              installType="guild"
              startIcon={faSquarePlus}
              title={t('common:add-app.guild.title')}
              description={t('common:add-app.guild.description')}
            />
          </Flex>
        </Flex>
      </Center>
    </Layout>
  );
};

export default DiscordAppPage;

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => ({
  props: {
    ...(await typedServerSideTranslations(locale)),
  },
});

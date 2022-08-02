import { MantineProvider } from '@mantine/core';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { DefaultSeo } from 'next-seo';
import { AppComponent } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import 'src/app.scss';
import { SITE_TITLE } from 'src/config';
import 'src/fontawesome';
import { assembleSeoUrl, getDirAttribute, useLocale } from 'src/util/common';
import { getEmotionCache, themeOverride } from 'src/util/styling';
import '../dayjs-locales';
import '../moment-locales';

const App: AppComponent = ({ Component, pageProps }) => {
  const { asPath, defaultLocale, locale, locales } = useRouter();

  const languageAlternates = useMemo(
    () =>
      locales?.map((hrefLang) => ({
        hrefLang,
        href: (hrefLang !== defaultLocale ? `/${hrefLang}` : '') + asPath,
      })),
    [asPath, defaultLocale, locales],
  );

  const { t } = useTranslation();

  const ltrOptions = useMemo(() => {
    const dir = getDirAttribute(locale);
    const emotionCache = getEmotionCache(dir);
    return {
      dir,
      emotionCache,
    };
  }, [locale]);
  useEffect(() => {
    document.documentElement.setAttribute('dir', ltrOptions.dir);
  }, [ltrOptions.dir]);

  const momentLocale = useLocale(locale);

  const theme = useMemo(() => ({ dir: ltrOptions.dir, ...themeOverride }), [ltrOptions.dir]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{SITE_TITLE}</title>
      </Head>
      <DefaultSeo
        title={SITE_TITLE}
        description={t('common:seoDescription')}
        openGraph={{
          type: 'website',
          locale,
          site_name: SITE_TITLE,
          url: assembleSeoUrl(asPath),
          images: [
            {
              alt: '<t:1626299131:R> ⬇ 5 hours ago',
              url: assembleSeoUrl(`/social/${momentLocale}.png`),
              width: 1200,
              height: 630,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@DJDavid98',
        }}
        languageAlternates={languageAlternates}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'discord,chat,formatting,timestamps,date,markdown',
          },
        ]}
      />
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme} emotionCache={ltrOptions.emotionCache}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

export default appWithTranslation(App);

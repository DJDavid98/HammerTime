import { appWithTranslation, useTranslation } from 'next-i18next';
import { DefaultSeo } from 'next-seo';
import { AppComponent } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import 'src/app.scss';
import { isAvailableLanguage, SITE_TITLE } from 'src/config';
import 'src/fontawesome';
import { assembleSeoUrl, getDirAttribute, useLocale } from 'src/util/common';
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

  useEffect(() => {
    if (!locale || !isAvailableLanguage(locale)) return;

    const direction = getDirAttribute(locale);
    document.documentElement.setAttribute('dir', direction);
  }, [locale]);

  const momentLocale = useLocale(locale);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#5865F2" />
        <meta name="color-scheme" content="dark" />

        <link rel="icon" href="/logos/logo-light.png" media="(prefers-color-scheme:no-preference)" />
        <link rel="icon" href="/logos/logo-dark.png" media="(prefers-color-scheme:dark)" />
        <link rel="icon" href="/logos/logo-light.png" media="(prefers-color-scheme:light)" />
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
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(App);

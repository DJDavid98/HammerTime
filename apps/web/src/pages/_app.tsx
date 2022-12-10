import { appWithTranslation, useTranslation } from 'next-i18next';
import { DefaultSeo, NextSeoProps } from 'next-seo';
import { AppComponent } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import 'src/styles/app.scss';
import { SITE_TITLE } from '../config';
import { assembleSeoUrl, canonicalUrlForLanguage, getDirAttribute, useLocale } from '../util/common';
import '@hammertime/dayjs';

const nextSeoTwitter: NextSeoProps['twitter'] = {
  cardType: 'summary_large_image',
  handle: '@DJDavid98',
};
const nextSeoAdditionalMetaTags: NextSeoProps['additionalMetaTags'] = [
  {
    name: 'keywords',
    content: 'discord,chat,formatting,timestamps,date,markdown',
  },
];

const App: AppComponent = ({ Component, pageProps }) => {
  const { asPath, defaultLocale, locale, locales } = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- It's a polyfill, we don't care about its types
    // @ts-ignore
    import('datalist-polyfill');
  }, []);

  const canonicalUrl = useMemo(() => canonicalUrlForLanguage(asPath, locale, defaultLocale), [asPath, defaultLocale, locale]);
  const languageAlternates = useMemo(
    () => [
      ...(locales ?? [])?.map((hrefLang) => ({
        hrefLang,
        href: canonicalUrlForLanguage(asPath, hrefLang, defaultLocale),
      })),
      {
        hrefLang: 'x-default',
        href: canonicalUrlForLanguage(asPath, defaultLocale, defaultLocale),
      },
    ],
    [asPath, defaultLocale, locales],
  );

  const { t } = useTranslation();

  const dir = useMemo(() => getDirAttribute(locale), [locale]);
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
  }, [dir]);

  const momentLocale = useLocale(locale);
  const nextSeoOpenGraph: NextSeoProps['openGraph'] = useMemo(
    () => ({
      type: 'website',
      locale,
      site_name: SITE_TITLE,
      url: assembleSeoUrl(asPath),
      images: [
        {
          url: assembleSeoUrl(`/social/preview/${momentLocale}.png`),
          width: 1200,
          height: 630,
        },
      ],
    }),
    [asPath, locale, momentLocale],
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{SITE_TITLE}</title>
      </Head>
      <DefaultSeo
        title={SITE_TITLE}
        description={t('common:seoDescription')}
        openGraph={nextSeoOpenGraph}
        twitter={nextSeoTwitter}
        canonical={canonicalUrl}
        languageAlternates={languageAlternates}
        additionalMetaTags={nextSeoAdditionalMetaTags}
      />
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(App);

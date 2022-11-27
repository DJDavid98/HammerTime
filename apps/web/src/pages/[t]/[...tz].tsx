import { TimezonePicker } from '../../components/TimezonePicker';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { SSRConfig } from 'next-i18next';
import { useMemo, useState } from 'react';
import { getSortedNormalizedTimezoneNames, useTimestampPreservation } from '../../util/timezone';
import { typedServerSideTranslations } from '../../util/i18n-server';
import { useRouter } from 'next/router';
import { TimezoneNamesContextProvider } from '../../contexts/TimezoneNamesContext';
import { GetStaticPathsResult } from 'next/types';
import { AppContainer } from '../../components/AppContainer';
import { Layout } from '../../components/Layout';
import { TimezoneContextProvider, TimezoneContextValue } from '../../contexts/TimezoneContext';
import { TimestampContextProvider, TimestampContextValue } from '../../contexts/TimestampContext';
import { DateTimePicker } from '../../components/DateTimePicker';

const timestampQueryParam = 't';
const timezoneQueryParam = 'tz';

const TimezonePage: NextPage = () => {
  const router = useRouter();

  const tzNames = useMemo(() => getSortedNormalizedTimezoneNames(), []);
  const timezoneContext: TimezoneContextValue = useState<string>('');
  const timestampContext: TimestampContextValue = useState<number>(0);
  useTimestampPreservation(router, timestampQueryParam, timezoneQueryParam, timezoneContext, timestampContext);

  return (
    <Layout>
      <AppContainer>
        <TimestampContextProvider value={timestampContext}>
          <TimezoneContextProvider value={timezoneContext}>
            <TimezoneNamesContextProvider value={tzNames}>
              <DateTimePicker />
              <TimezonePicker />
            </TimezoneNamesContextProvider>
          </TimezoneContextProvider>
        </TimestampContextProvider>
      </AppContainer>
    </Layout>
  );
};

export default TimezonePage;

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => ({
  props: {
    ...(await typedServerSideTranslations(locale, ['common'])),
  },
});

export const getStaticPaths: GetStaticPaths = () => {
  const result: GetStaticPathsResult = {
    paths: [],
    fallback: true,
  };
  return result;
};

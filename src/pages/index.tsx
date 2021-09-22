import { AppContainer } from 'components/AppContainer';
import { CustomIcon } from 'components/CustomIcon';
import { Layout } from 'components/Layout';
import { TimestampPicker } from 'components/TimestampPicker';
import { TimestampsTable } from 'components/TimestampsTable';
import { throttle } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import { GetStaticProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { SITE_TITLE } from 'src/config';
import { useLocale } from 'src/util/common';
import { typedServerSideTranslations } from 'src/util/i18n-server';
import { getSortedNormalizedTimezoneNames, getTimezoneValue, isoDateFormat, isoTimeFormat } from 'src/util/timezone';

interface IndexPageProps {
  tzNames: string[];
}

const IndexPage: VFC<IndexPageProps> = ({ tzNames }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const timezoneNames = useMemo(() => tzNames.map((timezone) => getTimezoneValue(timezone)), [tzNames]);
  const [timezone, setTimezone] = useState<string>(() => timezoneNames[0].value);
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [timestamp, setTimestamp] = useState<Moment | null>(null);

  const handleTimezoneChange = useMemo(
    () =>
      throttle((value: null | string) => {
        const newTimeZone = value === null ? moment.tz.guess() : value;
        setTimezone(newTimeZone);
      }, 200),
    [],
  );
  const handleDateChange = useMemo(
    () =>
      throttle((value: null | string) => {
        setDateString(value || '');
      }, 200),
    [],
  );
  const handleTimeChange = useCallback((value: null | string) => {
    setTimeString(value || '');
  }, []);

  useEffect(() => {
    const clientMoment = moment().seconds(0).milliseconds(0);
    setTimeString(clientMoment.format(isoTimeFormat));
    setDateString(clientMoment.format(isoDateFormat));
    handleTimezoneChange(null);
  }, [handleTimezoneChange]);

  useEffect(() => {
    if (!dateString || !timeString) return;
    setTimestamp(moment.tz(`${dateString}T${timeString}`, timezone));
  }, [dateString, timeString, timezone]);

  const commonProps = {
    locale,
    t,
  };

  const syntaxColName = useMemo(() => {
    const originalText = t('common:table.syntax');
    // Lowercase column name in text only for this language
    if (locale === 'pt-br') {
      return originalText.toLowerCase();
    }
    return originalText;
  }, [locale, t]);

  return (
    <Layout>
      <AppContainer bg="discord">
        <h1 className="text-center">
          <CustomIcon src="/logos/app.svg" alt="" />
          <span className="mx-3">{SITE_TITLE}</span>
        </h1>
        <p className="text-center">{t('common:howTo', { syntaxColName })}</p>

        <TimestampPicker
          {...commonProps}
          dateString={dateString}
          timeString={timeString}
          changeTimezone={handleTimezoneChange}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          timezone={timezone}
          timezoneNames={timezoneNames}
        />
        <TimestampsTable {...commonProps} timestamp={timestamp} />
      </AppContainer>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps<IndexPageProps & SSRConfig> = async ({ locale }) => ({
  props: {
    tzNames: getSortedNormalizedTimezoneNames(),
    ...(await typedServerSideTranslations(locale, ['common'])),
  },
});

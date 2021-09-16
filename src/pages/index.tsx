import { AppContainer } from 'components/AppContainer';
import { CustomIcon } from 'components/CustomIcon';
import { Layout } from 'components/Layout';
import { TimestampPicker } from 'components/TimestampPicker';
import { TimestampsTable } from 'components/TimestampsTable';
import moment, { Moment } from 'moment-timezone';
import { GetStaticProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { SITE_TITLE } from 'src/config';
import { useLocale } from 'src/util/common';
import { typedServerSideTranslations } from 'src/util/i18n-server';
import { getSortedNormalizedTimezoneNames, getTimezoneValue } from 'src/util/timezone';

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
  const [timestamp, setTimestamp] = useState<Moment>(() => moment(new Date(0)).utc());
  const [inputValue, setInputValue] = useState<Moment | string>('');

  const handleDateChange = useCallback((value: Moment | string) => {
    if (moment.isMoment(value)) {
      setTimestamp(value);
    }
    setInputValue(value);
  }, []);
  const handleTimezoneChange = useCallback((value: null | string) => {
    const newTimeZone = value === null ? moment.tz.guess() : value;
    setTimezone(newTimeZone);
  }, []);

  useEffect(() => {
    const clientMoment = moment().seconds(0).milliseconds(0);
    handleDateChange(clientMoment);
    handleTimezoneChange(null);
  }, [handleDateChange, handleTimezoneChange]);

  const commonProps = {
    locale,
    timestamp,
    timezone,
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
          changeTimezone={handleTimezoneChange}
          handleDateChange={handleDateChange}
          datetime={inputValue}
          timezoneNames={timezoneNames}
        />
        <TimestampsTable {...commonProps} />
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

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

const forceFirstTimezoneSet = 'GMT';

const IndexPage: VFC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const timezoneNames = useMemo(() => {
    let compare = (a: string, b: string): number => a.localeCompare(b);
    try {
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      compare = collator.compare;
    } catch (e) {
      console.error(e);
    }
    return moment.tz
      .names()
      .sort((a, b) => (forceFirstTimezoneSet === a ? -1 : forceFirstTimezoneSet === b ? 1 : compare(a, b)))
      .map((value) => ({ label: value, value }));
  }, []);
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
    const clientMoment = moment();
    handleDateChange(clientMoment);
    handleTimezoneChange(null);
  }, [handleDateChange, handleTimezoneChange]);

  const commonProps = {
    locale,
    timestamp,
    timezone,
    t,
  };

  return (
    <Layout>
      <AppContainer bg="discord">
        <h1 className="text-center">
          <CustomIcon src="/logos/app.svg" className="mr-3" alt="" />
          {SITE_TITLE}
        </h1>
        <p className="text-center">{t('common:howTo', { syntaxColName: t('common:table.syntax') })}</p>

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

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => ({
  props: {
    ...(await typedServerSideTranslations(locale, ['common'])),
  },
});

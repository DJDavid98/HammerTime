import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button, MantineSize, Paper, Tooltip } from '@mantine/core';
import { DatesProvider, DayOfWeek } from '@mantine/dates';
import { DatesProviderSettings } from '@mantine/dates/lib/components/DatesProvider/DatesProvider';
import { AppContainer } from 'components/app/AppContainer';
import { Layout } from 'components/app/Layout';
import { LockButton } from 'components/LockButton';
import { TimestampPicker } from 'components/TimestampPicker';
import { TimestampsTable } from 'components/TimestampsTable';
import { UsefulLinks } from 'components/UsefulLinks';
import { getCookie, setCookies } from 'cookies-next';
import { parseInt, throttle } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import { GetStaticProps, NextPage } from 'next';
import { SSRConfig } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { useServerTimeSync } from 'src/hooks/useServerTimeSync';
import { useLocale } from 'src/util/common';
import { typedServerSideTranslations } from 'src/util/i18n-server';
import {
  getSortedNormalizedTimezoneNames,
  getTimezoneValue,
  isoFormattingDateFormat,
  isoParsingDateFormat,
  isoTimeFormat,
  momentToTimeInputValue,
} from 'src/util/timezone';

interface IndexPageProps {
  tzNames: string[];
}

const TS_QUERY_PARAM = 't';
const howToCookieName = 'how-to-dismiss';
const howToCookieValue = 'how-to-dismiss';

export const IndexPage: NextPage<IndexPageProps> = ({ tzNames }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const timezoneNames = useMemo(() => tzNames.map((timezone) => getTimezoneValue(timezone)), [tzNames]);
  const [showHowTo, setShowHowTo] = useState(false);
  const [defaultTimezone, setDefaultTimezone] = useState<string>(() => timezoneNames[0].value);
  const [timezone, setTimezone] = useState<string | undefined>();
  const safeTimezone = useMemo(() => timezone ?? defaultTimezone, [defaultTimezone, timezone]);
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const router = useRouter();
  const timestampQuery = router.query[TS_QUERY_PARAM];
  const initialTimestamp = useMemo<number | null>(() => {
    if (typeof timestampQuery === 'string') {
      const timestampNumber = parseInt(timestampQuery, 10);
      if (!isNaN(timestampNumber) && isFinite(timestampNumber)) {
        try {
          // Make sure timestamp value can be parsed by Date constructor before accepting it
          return Math.round(new Date(timestampNumber * 1e3).getTime() / 1e3);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  }, [timestampQuery]);
  const [timestamp, setTimestamp] = useState<Moment | null>(null);
  const timestampInSecondsString = useMemo(() => (timestamp ? timestamp?.unix().toString() : '0'), [timestamp]);

  const handleTimezoneChange = useMemo(
    () =>
      throttle((value: null | string) => {
        const newTimeZone = value === null ? undefined : value;
        setTimezone(newTimeZone);
      }, 200),
    [],
  );
  const handleDateChange = useMemo(
    () =>
      throttle((value: null | string) => {
        setDateString(value || momentToTimeInputValue(moment(), isoFormattingDateFormat));
      }, 200),
    [],
  );
  const setDateTimeString = useCallback((value: string) => {
    const [dateStr, timeStr] = value.split(/[T ]/);
    setTimeString(timeStr);
    setDateString(dateStr);
  }, []);
  const handleTimeChange = useCallback((value: null | string) => {
    setTimeString(value || momentToTimeInputValue(moment(), isoTimeFormat));
  }, []);
  const handleDateTimeChange = useMemo(
    () =>
      throttle((value: null | string) => {
        setDateTimeString(value || momentToTimeInputValue(moment(), `${isoFormattingDateFormat} ${isoTimeFormat}`));
      }, 50),
    [setDateTimeString],
  );
  const setTimeNow = useCallback(() => {
    // Get local time zone
    const guessed = moment.tz.guess();
    // Create a timestamp in local timezone and convert it to selected timezone
    const value = moment.tz(guessed).tz(safeTimezone);
    setDateTimeString(momentToTimeInputValue(value));
  }, [safeTimezone, setDateTimeString]);
  const handleHowToClose = () => {
    setCookies(howToCookieName, howToCookieValue, {
      expires: moment().add(2, 'years').toDate(),
    });
    setShowHowTo(false);
  };

  useEffect(() => {
    // Get local time zone
    setDefaultTimezone(moment.tz.guess());

    setShowHowTo(getCookie(howToCookieName) !== howToCookieValue);
  }, []);

  useEffect(() => {
    let clientMoment: Moment | undefined;
    let clientTimezone: string | null = null;
    if (typeof initialTimestamp === 'number') {
      const initialDate = moment.tz(initialTimestamp * 1000, 'GMT');
      if (initialDate.isValid()) {
        clientTimezone = 'GMT';
        clientMoment = initialDate;
      }
    }
    if (!clientMoment) clientMoment = moment().seconds(0).milliseconds(0);
    const formatted = momentToTimeInputValue(clientMoment);
    handleDateTimeChange(formatted);
    handleTimezoneChange(clientTimezone);
  }, [handleDateTimeChange, handleTimezoneChange, initialTimestamp]);

  useEffect(() => {
    if (!dateString || !timeString) return;
    setTimestamp(moment.tz(`${dateString}T${timeString}`, `${isoParsingDateFormat}T${isoTimeFormat}`, safeTimezone));
  }, [dateString, safeTimezone, timeString, timezone]);

  const syntaxColName = useMemo(() => {
    const originalText = t('common:table.syntax');
    // Lowercase column name in text only for this language
    if (locale === 'pt-br') {
      return originalText.toLowerCase();
    }
    return originalText;
  }, [locale, t]);

  const fixedTimestamp = initialTimestamp !== null;
  const { lockButtonTooltipText, setTimeButtonTooltipText, leadText } = useMemo(() => {
    const options = {
      defaultValue: false,
      fallbackLng: [],
    };
    return {
      lockButtonTooltipText: t(fixedTimestamp ? 'common:buttons.unlock' : 'common:buttons.lock', options) as string | null,
      setTimeButtonTooltipText: t('common:buttons.setCurrentTime', options) as string | null,
      leadText: t('common:usefulLinks.lead', options) as string | null,
    };
  }, [fixedTimestamp, t]);

  const ButtonsComponent = useMemo(
    (): FC<PropsWithChildren<{ size: MantineSize }>> =>
      ({ size, children }) =>
        (
          <>
            <Tooltip label={setTimeButtonTooltipText}>
              <Button size={size} color="gray" onClick={setTimeNow} disabled={fixedTimestamp}>
                <FontAwesomeIcon icon="clock-rotate-left" />
              </Button>
            </Tooltip>{' '}
            <LockButton
              href={fixedTimestamp ? '/' : `/?${TS_QUERY_PARAM}=${timestampInSecondsString}`}
              size={size}
              lockButtonTooltipText={lockButtonTooltipText}
              fixedTimestamp={fixedTimestamp}
            />
            {children}
          </>
        ),
    [fixedTimestamp, lockButtonTooltipText, setTimeButtonTooltipText, setTimeNow, timestampInSecondsString],
  );

  const dateProviderSettings: DatesProviderSettings = useMemo(() => {
    const languageConfig = LANGUAGES[locale as AvailableLanguage];
    return {
      locale,
      firstDayOfWeek: (languageConfig?.firstDayOfWeek ?? moment.localeData(locale).firstDayOfWeek()) as DayOfWeek,
      weekendDays: (languageConfig?.weekendDays ?? []) as DayOfWeek[],
    };
  }, [locale]);

  useServerTimeSync(t);

  return (
    <Layout>
      <DatesProvider settings={dateProviderSettings}>
        <AppContainer>
          {showHowTo && (
            <Alert
              title={t('common:seoDescription')}
              icon={<FontAwesomeIcon icon="info" fixedWidth />}
              color="dark"
              withCloseButton
              onClose={handleHowToClose}
            >
              {t('common:howTo', { syntaxColName })}
            </Alert>
          )}

          <noscript>
            <Alert
              title={t('common:jsDisabled.title')}
              icon={<FontAwesomeIcon icon="exclamation-triangle" fixedWidth />}
              color="red"
              onClose={handleHowToClose}
            >
              {t('common:jsDisabled.body')}
            </Alert>
          </noscript>

          <Paper p="lg">
            <TimestampPicker
              t={t}
              locale={locale}
              language={language}
              dateString={dateString}
              timeString={timeString}
              changeTimezone={handleTimezoneChange}
              handleDateChange={handleDateChange}
              handleTimeChange={handleTimeChange}
              handleDateTimeChange={handleDateTimeChange}
              timezone={timezone}
              defaultTimezone={defaultTimezone}
              timezoneNames={timezoneNames}
              fixedTimestamp={fixedTimestamp}
              ButtonsComponent={ButtonsComponent}
            />
            <TimestampsTable t={t} locale={locale} timestamp={timestamp} timeInSeconds={timestampInSecondsString} />
          </Paper>

          {!!leadText && (
            <Paper p="lg">
              <UsefulLinks t={t} leadText={leadText} />
            </Paper>
          )}
        </AppContainer>
      </DatesProvider>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps<IndexPageProps & SSRConfig> = async ({ locale, params }) => {
  const timestamp = params?.timestamp;
  let initialTimestamp: number | null = null;
  if (typeof timestamp === 'string') {
    const timestampNumber = parseInt(timestamp, 10);
    if (!isNaN(timestampNumber) && isFinite(timestampNumber)) {
      initialTimestamp = timestampNumber;
    }
  }
  return {
    props: {
      initialTimestamp,
      tzNames: getSortedNormalizedTimezoneNames(),
      ...(await typedServerSideTranslations(locale)),
    },
  };
};

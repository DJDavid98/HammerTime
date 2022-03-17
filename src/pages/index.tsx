import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContainer } from 'components/AppContainer';
import { CustomIcon } from 'components/CustomIcon';
import { Layout } from 'components/Layout';
import { TimestampPicker } from 'components/TimestampPicker';
import { TimestampsTable } from 'components/TimestampsTable';
import { TooltipContent } from 'components/TooltipContent';
import { parseInt, throttle } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import { GetStaticProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState, VFC } from 'react';
import { Button, FormGroup, UncontrolledTooltip } from 'reactstrap';
import { SITE_TITLE } from 'src/config';
import { useLocale } from 'src/util/common';
import { typedServerSideTranslations } from 'src/util/i18n-server';
import { getSortedNormalizedTimezoneNames, getTimezoneValue, momentToTimeInputValue } from 'src/util/timezone';

interface IndexPageProps {
  tzNames: string[];
}

const TS_QUERY_PARAM = 't';

export const IndexPage: VFC<IndexPageProps> = ({ tzNames }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const timezoneNames = useMemo(() => tzNames.map((timezone) => getTimezoneValue(timezone)), [tzNames]);
  const [timezone, setTimezone] = useState<string>(() => timezoneNames[0].value);
  const [dateTimeString, setDateTimeString] = useState<string>('');
  const router = useRouter();
  const timestampQuery = router.query[TS_QUERY_PARAM];
  const initialTimestamp = useMemo<number | null>(() => {
    if (typeof timestampQuery === 'string') {
      const timestampNumber = parseInt(timestampQuery, 10);
      if (!isNaN(timestampNumber) && isFinite(timestampNumber)) {
        return timestampNumber;
      }
    }
    return null;
  }, [timestampQuery]);
  const [timestamp, setTimestamp] = useState<Moment | null>(null);
  const timestampInSeconds = useMemo(() => String(timestamp?.unix() || '0'), [timestamp]);
  const setTimeButtonRef = useRef<HTMLButtonElement>(null);
  const lockButtonRef = useRef<HTMLButtonElement>(null);

  const handleTimezoneChange = useMemo(
    () =>
      throttle((value: null | string) => {
        const newTimeZone = value === null ? moment.tz.guess() : value;
        setTimezone(newTimeZone);
      }, 200),
    [],
  );
  const handleDateTimeChange = useMemo(
    () =>
      throttle((value: null | string) => {
        setDateTimeString(value || '');
      }, 50),
    [],
  );
  const setTimeNow = useCallback(() => {
    setDateTimeString(momentToTimeInputValue());
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
    if (!dateTimeString) return;
    setTimestamp(moment.tz(dateTimeString, timezone));
  }, [dateTimeString, timezone]);

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

  const fixedTimestamp = initialTimestamp !== null;
  const lockButtonTooltipText = t(fixedTimestamp ? 'common:buttons.unlock' : 'common:buttons.lock', '');
  const setTimeButtonTooltipText = t('common:buttons.setCurrentTime', '');

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
          dateTimeString={dateTimeString}
          changeTimezone={handleTimezoneChange}
          handleDateTimeChange={handleDateTimeChange}
          timezone={timezone}
          timezoneNames={timezoneNames}
          fixedTimestamp={fixedTimestamp}
        >
          <FormGroup>
            <Button size="lg" className="me-2" onClick={setTimeNow} disabled={fixedTimestamp} innerRef={setTimeButtonRef}>
              <FontAwesomeIcon icon="clock-rotate-left" />
            </Button>
            {Boolean(setTimeButtonTooltipText) && (
              <UncontrolledTooltip target={setTimeButtonRef} fade={false}>
                {setTimeButtonTooltipText}
              </UncontrolledTooltip>
            )}
            <Link href={fixedTimestamp ? '/' : `/?${TS_QUERY_PARAM}=${timestampInSeconds}`} passHref>
              <Button tag="a" innerRef={lockButtonRef} size="lg" color={fixedTimestamp ? 'danger' : 'info'}>
                <FontAwesomeIcon icon={fixedTimestamp ? 'unlock' : 'lock'} />
              </Button>
            </Link>
            {Boolean(lockButtonTooltipText) && (
              <UncontrolledTooltip target={lockButtonRef} fade={false}>
                {({ update }) => <TooltipContent update={update}>{lockButtonTooltipText}</TooltipContent>}
              </UncontrolledTooltip>
            )}
          </FormGroup>
        </TimestampPicker>
        <TimestampsTable {...commonProps} timestamp={timestamp} timeInSeconds={timestampInSeconds} />
      </AppContainer>
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
      ...(await typedServerSideTranslations(locale, ['common'])),
    },
  };
};

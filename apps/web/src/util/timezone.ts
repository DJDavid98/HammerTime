import dayjs from '@hammertime/dayjs';
import { timeZonesNames } from '@vvo/tzdb';
import { NextRouter } from 'next/router';
import { useEffect } from 'react';
import { TimezoneContextValue } from '../contexts/TimezoneContext';
import { TimestampContextValue } from '../contexts/TimestampContext';

export const isoTimeFormat = 'HH:mm:ss';
export const isoDateFormat = 'YYYY-MM-DD';

export const gmtZoneRegex = /^Etc\/(GMT([+-]\d{1,2})?)$/;

const compareGmtStrings = (a: string, b: string) =>
  parseInt(a.replace(gmtZoneRegex, '$2'), 10) - parseInt(b.replace(gmtZoneRegex, '$2'), 10);

export const getSortedNormalizedTimezoneNames = (): string[] =>
  timeZonesNames
    .filter((name) => !/^(?:Etc\/)?GMT[+-]0$/.test(name))
    .sort((a, b) => {
      const isAGmt = gmtZoneRegex.test(a);
      const isBGmt = gmtZoneRegex.test(b);
      if (isAGmt) return isBGmt ? compareGmtStrings(a, b) : -1;
      if (isBGmt) return isAGmt ? compareGmtStrings(a, b) : 1;
      return a.localeCompare(b);
    });

export const isValidTimezone = (timeZone: string): boolean => {
  if (gmtZoneRegex.test(timeZone)) {
    return true;
  }
  try {
    new Date().toLocaleString('en-GB', { timeZone });
    return true;
  } catch (e) {
    if (e instanceof RangeError && e.message.includes('invalid time zone')) {
      return false;
    }
    throw e;
  }
};

export const isValidTimestamp = (timestamp: number): boolean => {
  const value = new Date(timestamp);
  return value.toString() !== 'Invalid date';
};

export const preserveTimestampInUrl = (router: NextRouter, clientTimestamp: dayjs.Dayjs, clientTimezone: string): Promise<boolean> => {
  const query = { t: String(clientTimestamp.unix()), tz: clientTimezone.split('/') };
  if (router.query.t !== query.t || router.query.tz?.toString() !== query.tz.toString()) {
    return router.replace(`/${query.t}/${query.tz.join('/')}`, undefined, { shallow: true });
  }

  return Promise.resolve(true);
};

export const useTimestampPreservation = (
  router: NextRouter,
  timestampQueryParam: string,
  timezoneQueryParam: string,
  timezoneContext: TimezoneContextValue,
  timestampContext: TimestampContextValue,
) => {
  const [, setTimezone] = timezoneContext;
  const [, setTimestamp] = timestampContext;
  const timestampQuery = router.query[timestampQueryParam];
  const timezoneQuery = router.query[timezoneQueryParam];

  useEffect(() => {
    const getInitialTimestamp = () => {
      if (typeof timestampQuery === 'string') {
        const timezone =
          typeof timezoneQuery !== 'undefined' ? (Array.isArray(timezoneQuery) ? timezoneQuery.join('/') : timezoneQuery) : 'GMT';
        const timestamp = dayjs.tz(parseInt(timestampQuery, 10) * 1000, timezone);
        if (timestamp.isValid()) {
          return { timestamp, timezone };
        }
      }
      return null;
    };
    const initial = getInitialTimestamp();

    let clientTimestamp: dayjs.Dayjs;
    let clientTimezone: string;
    if (initial?.timestamp?.isValid()) {
      clientTimestamp = initial.timestamp;
      clientTimezone = initial.timezone;
    } else {
      clientTimezone = dayjs.tz.guess();
      clientTimestamp = dayjs().second(0).millisecond(0);
    }
    // TODO Worry about this later
    // void preserveTimestampInUrl(router, clientTimestamp, clientTimezone);
    setTimezone(clientTimezone);
    setTimestamp(clientTimestamp.unix());
  }, [router, setTimestamp, setTimezone, timestampQuery, timezoneQuery]);
};

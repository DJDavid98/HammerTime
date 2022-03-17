import { Moment } from 'moment';
import moment from 'moment-timezone';

export const isoTimeFormat = 'HH:mm:ss';
export const isoDateFormat = 'YYYY-MM-DD';

export const gmtZoneRegex = /^Etc\/(GMT([+-]\d+)?)$/;

export const switchGmtZoneName = (value: string): string =>
  value.replace(gmtZoneRegex, (_, extractedIdentifier: string) => extractedIdentifier.replace(/([+-])/, (m) => (m === '+' ? '-' : '+')));

const compareGmtStrings = (a: string, b: string) =>
  parseInt(a.replace(gmtZoneRegex, '$2'), 10) - parseInt(b.replace(gmtZoneRegex, '$2'), 10);

export const getSortedNormalizedTimezoneNames = (): string[] =>
  moment.tz
    .names()
    .filter((name) => !/^(?:Etc\/)?GMT[+-]0$/.test(name))
    .sort((a, b) => {
      const isAGmt = gmtZoneRegex.test(a);
      const isBGmt = gmtZoneRegex.test(b);
      if (isAGmt) return isBGmt ? compareGmtStrings(a, b) : -1;
      if (isBGmt) return isAGmt ? compareGmtStrings(a, b) : 1;
      return a.localeCompare(b);
    });

export const getTimezoneLabel = (timezone: string): string => {
  if (!gmtZoneRegex.test(timezone)) return timezone;
  return switchGmtZoneName(timezone);
};

export const getTimezoneValue = (timezone: string) => ({
  value: timezone,
  label: getTimezoneLabel(timezone),
});

export const momentToTimeInputValue = (time: Moment = moment()): string => time.format(`${isoDateFormat}\\T${isoTimeFormat}`);

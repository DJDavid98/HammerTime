import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Select, useMantineTheme } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import type { FirstDayOfWeek } from '@mantine/dates/lib/types';
import styles from 'modules/TimestampPicker.module.scss';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState, VFC, VoidFunctionComponent } from 'react';
import { TFunction } from 'react-i18next';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDayStyle } from 'src/util/styling';

const timeInputClassNames = { controls: styles.timeInputControl };
const firstDayOfWeekOverrideRecord: Partial<Record<string, FirstDayOfWeek>> = {
  ms: 'sunday',
  // Not possible until https://github.com/mantinedev/mantine/discussions/1759 is resolved
  // ar: 'saturday',
};

interface TimezoneOptionType {
  label: string;
  value: string;
}

interface PropTypes {
  locale: string;
  dateString: string;
  changeTimezone: (tz: null | string) => void;
  fixedTimestamp: boolean;
  handleDateChange: (value: string | null) => void;
  handleTimeChange: (value: string | null) => void;
  t: TFunction;
  timeString: string;
  timezone?: string;
  defaultTimezone: string;
  timezoneNames: TimezoneOptionType[];
  ButtonsComponent: VoidFunctionComponent;
}

export const TimestampPicker: VFC<PropTypes> = ({
  changeTimezone,
  dateString,
  fixedTimestamp,
  handleDateChange: onDateChange,
  handleTimeChange: onTimeChange,
  t,
  timeString,
  locale,
  timezone,
  defaultTimezone,
  timezoneNames,
  ButtonsComponent,
}) => {
  const {
    i18n: { language },
  } = useTranslation();
  const handleTimezoneChange = useCallback(
    (selected: TimezoneOptionType['value'] | null) => {
      changeTimezone(selected);
    },
    [changeTimezone],
  );
  const date = useMemo(() => (dateString && timeString ? new Date(`${dateString}T${timeString}`) : new Date(0)), [dateString, timeString]);
  const timeFormat = useMemo(() => (moment.localeData(locale).longDateFormat('LT').includes('A') ? '12' : '24'), [locale]);
  const firstDayOfWeekOverride = useMemo(() => firstDayOfWeekOverrideRecord[locale], [locale]);
  const { calendarLabelFormat } = useMemo(() => LANGUAGES[language as AvailableLanguage], [language]);
  const amLabel = useMemo(() => moment.localeData(locale).meridiem(1, 0, true), [locale]);
  const pmLabel = useMemo(() => moment.localeData(locale).meridiem(13, 0, true), [locale]);
  const theme = useMantineTheme();
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const todayUpdateInterval = setInterval(() => {
      setToday(new Date());
    }, 60e3);

    return () => clearInterval(todayUpdateInterval);
  }, []);

  const handleDateChange = useCallback(
    (value: Date | null) => {
      onDateChange(value && moment(value).format('YYYY-MM-DD'));
    },
    [onDateChange],
  );
  const handleTimeChange = useCallback(
    (value: Date | null) => {
      onTimeChange(value && moment(value).format('HH:mm:ss'));
    },
    [onTimeChange],
  );
  const dayStyle = useMemo(() => getDayStyle(theme, today), [theme, today]);

  return (
    <Group align="end" className={styles.timestampPicker}>
      <DatePicker
        label={t('common:input.date')}
        locale={locale}
        value={date}
        icon={<FontAwesomeIcon icon="calendar" fixedWidth />}
        size="lg"
        onChange={handleDateChange}
        disabled={fixedTimestamp}
        clearable={false}
        dayStyle={dayStyle}
        firstDayOfWeek={firstDayOfWeekOverride}
        labelFormat={calendarLabelFormat}
      />
      <TimeInput
        value={date}
        icon={<FontAwesomeIcon icon="clock" fixedWidth />}
        size="lg"
        onChange={handleTimeChange}
        withSeconds
        format={timeFormat}
        disabled={fixedTimestamp}
        clearable={false}
        classNames={timeInputClassNames}
        amLabel={amLabel}
        pmLabel={pmLabel}
      />
      <Select
        label={t('common:input.timezone')}
        value={timezone}
        data={timezoneNames}
        size="lg"
        placeholder={defaultTimezone}
        onChange={handleTimezoneChange}
        className="w-100"
        clearable
        searchable
        disabled={fixedTimestamp}
      />
      <Group align="end">
        <ButtonsComponent />
      </Group>
    </Group>
  );
};

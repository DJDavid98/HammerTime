import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Select } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import styles from 'modules/TimestampPicker.module.scss';
import moment from 'moment';
import { useCallback, useMemo, VFC, VoidFunctionComponent } from 'react';
import { TFunction } from 'react-i18next';

const timeInputClassNames = { controls: styles.timeInputControl };

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
  const handleTimezoneChange = useCallback(
    (selected: TimezoneOptionType['value'] | null) => {
      changeTimezone(selected);
    },
    [changeTimezone],
  );
  const date = useMemo(() => new Date(`${dateString}T${timeString}`), [dateString, timeString]);
  const timeFormat = useMemo(() => (moment.localeData(locale).longDateFormat('LT').includes('A') ? '12' : '24'), [locale]);
  const amLabel = useMemo(() => moment.localeData(locale).meridiem(1, 0, true), [locale]);
  const pmLabel = useMemo(() => moment.localeData(locale).meridiem(13, 0, true), [locale]);

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

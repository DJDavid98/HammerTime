import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Select } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import styles from 'modules/TimestampPicker.module.scss';
import moment, { Moment } from 'moment';
import { useCallback, useMemo, VFC, VoidFunctionComponent } from 'react';
import { TFunction } from 'react-i18next';

const timeInputClassNames = { controls: styles.timeInputControl };

interface TimezoneOptionType {
  label: string;
  value: string;
}

interface PropTypes {
  locale: string;
  changeTimezone: (tz: null | string) => void;
  timestamp: Moment | null;
  fixedTimestamp: boolean;
  handleDateChange: (value: Date | null) => void;
  t: TFunction;
  timezone?: string;
  defaultTimezone: string;
  timezoneNames: TimezoneOptionType[];
  ButtonsComponent: VoidFunctionComponent;
}

export const TimestampPicker: VFC<PropTypes> = ({
  changeTimezone,
  timestamp,
  fixedTimestamp,
  handleDateChange: onDateChange,
  t,
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
  const date = useMemo(() => timestamp?.toDate(), [timestamp]);
  const timeFormat = useMemo(() => (moment.localeData(locale).longDateFormat('LT').includes('A') ? '12' : '24'), [locale]);

  const handleDateChange = useCallback((value: Date | null) => onDateChange(value), [onDateChange]);

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
        onChange={handleDateChange}
        withSeconds
        format={timeFormat}
        disabled={fixedTimestamp}
        clearable={false}
        classNames={timeInputClassNames}
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

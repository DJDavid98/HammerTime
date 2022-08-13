import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, MantineSize, Select, useMantineTheme } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { CalendarSharedProps } from '@mantine/dates/lib/components/CalendarBase/CalendarBase';
import type { FirstDayOfWeek } from '@mantine/dates/lib/types';
import classNames from 'classnames';
import { CombinedDateTimeInput } from 'components/CombinedDateTimeInput';
import { DateTimeInput } from 'components/DateTimeInput';
import { InputSettings } from 'components/InputSettings';
import styles from 'modules/TimestampPicker.module.scss';
import moment from 'moment';
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import { TFunction } from 'react-i18next';
import { AvailableLanguage, LANGUAGES } from 'src/config';
import { getDayStyle } from 'src/util/styling';

const timeInputClassNames = { controls: styles.timeInputControl };
const firstDayOfWeekOverrideRecord: Partial<Record<string, FirstDayOfWeek>> = {
  ms: 'sunday',
  // Not possible until https://github.com/mantinedev/mantine/discussions/1759 is resolved
  // ar: 'saturday',
};

const dateInputId = 'date-input';
const timeInputId = 'time-input';
const dateTimeInputId = 'date-time-input';

interface TimezoneOptionType {
  label: string;
  value: string;
}

const splitPrefKey = 'split-input';
const customPrefKey = 'custom-input';

const smallInputSize = 'sm';
const largeInputSize = 'lg';
const largeInputThreshold = 768;

interface PropTypes {
  locale: string;
  dateString: string;
  changeTimezone: (tz: null | string) => void;
  fixedTimestamp: boolean;
  handleDateChange: (value: string | null) => void;
  handleTimeChange: (value: string | null) => void;
  handleDateTimeChange: (value: string | null) => void;
  t: TFunction;
  language: string;
  timeString: string;
  timezone?: string;
  defaultTimezone: string;
  timezoneNames: TimezoneOptionType[];
  ButtonsComponent: FunctionComponent<PropsWithChildren<{ size: MantineSize }>>;
}

export const TimestampPicker: VFC<PropTypes> = ({
  changeTimezone,
  dateString,
  fixedTimestamp,
  handleDateChange: onDateChange,
  handleTimeChange: onTimeChange,
  handleDateTimeChange: onDateTimeChange,
  t,
  language,
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
  const date = useMemo(() => (dateString && timeString ? new Date(`${dateString}T${timeString}`) : new Date(0)), [dateString, timeString]);
  const timeFormat = useMemo(() => (moment.localeData(locale).longDateFormat('LT').includes('A') ? '12' : '24'), [locale]);
  const firstDayOfWeekOverride = useMemo(() => firstDayOfWeekOverrideRecord[locale], [locale]);
  const { calendarLabelFormat } = useMemo(() => LANGUAGES[language as AvailableLanguage], [language]);
  const amLabel = useMemo(() => moment.localeData(locale).meridiem(1, 0, true), [locale]);
  const pmLabel = useMemo(() => moment.localeData(locale).meridiem(13, 0, true), [locale]);
  const theme = useMantineTheme();
  const [inputSize, setInputSize] = useState<MantineSize>(largeInputSize);
  const largeInputs = inputSize === largeInputSize;
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const todayUpdateInterval = setInterval(() => {
      setToday(new Date());
    }, 60e3);

    return () => clearInterval(todayUpdateInterval);
  }, []);
  useEffect(() => {
    const inputSizeQuery = window.matchMedia(`(min-width: ${largeInputThreshold}px)`);
    const updateInputSizes = (e: Pick<MediaQueryListEvent, 'matches'>) => {
      setInputSize(e.matches ? largeInputSize : smallInputSize);
    };

    inputSizeQuery.addEventListener('change', updateInputSizes);
    updateInputSizes(inputSizeQuery);
    return () => inputSizeQuery.removeEventListener('change', updateInputSizes);
  }, []);

  const handleDateChange = useCallback(
    (value: Date | ChangeEvent<HTMLInputElement> | null) => {
      onDateChange(value && (value instanceof Date ? moment(value).format('YYYY-MM-DD') : value.target.value));
    },
    [onDateChange],
  );
  const handleTimeChange = useCallback(
    (value: Date | ChangeEvent<HTMLInputElement> | null) => {
      onTimeChange(value && (value instanceof Date ? moment(value).format('HH:mm:ss') : value.target.value));
    },
    [onTimeChange],
  );
  const handleDateTimeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => onDateTimeChange(e.target.value),
    [onDateTimeChange],
  );
  const dayStyle = useMemo(() => getDayStyle(theme, today), [theme, today]);

  const datePickerA11y: Partial<CalendarSharedProps> = useMemo(
    () => ({
      nextMonthLabel: t('common:a11y.calendar.nextMonthLabel'),
      previousMonthLabel: t('common:a11y.calendar.previousMonthLabel'),
      nextYearLabel: t('common:a11y.calendar.nextYearLabel'),
      previousYearLabel: t('common:a11y.calendar.previousYearLabel'),
      nextDecadeLabel: t('common:a11y.calendar.nextDecadeLabel'),
      previousDecadeLabel: t('common:a11y.calendar.previousDecadeLabel'),
    }),
    [t],
  );

  const [combinedInput, setCombinedInput] = useState(false);
  const [customInput, setCustomInput] = useState(false);
  const toggleSeparateInputs: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCombinedInput(!e.target.checked);
  }, []);
  const toggleCustomInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setCustomInput(e.target.checked);
  }, []);

  useEffect(() => {
    const storedPref = localStorage.getItem(splitPrefKey);
    if (storedPref !== null) {
      setCombinedInput(storedPref !== 'true');
      return;
    }

    // Feature detection for datetime-local input
    const testInput = document.createElement('input');
    testInput.setAttribute('type', 'datetime-local');
    const testValue = '1)';
    testInput.value = testValue;
    setCombinedInput(testInput.value !== testValue);
  }, []);
  useEffect(() => {
    const storedPref = localStorage.getItem(customPrefKey);
    setCustomInput(storedPref === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(splitPrefKey, combinedInput ? 'false' : 'true');
  }, [combinedInput]);
  useEffect(() => {
    localStorage.setItem(customPrefKey, customInput ? 'true' : 'false');
  }, [customInput]);

  const dateTimeValue = date.getTime();
  const datePickerClearable = useMemo(() => date.toDateString() !== today.toDateString(), [date, today]);

  return (
    <Group align="end" className={styles.timestampPicker}>
      <Group align="end" className={classNames(styles.datetimePickerWrap, { [styles.combinedInputWrap]: combinedInput && !customInput })}>
        {customInput ? (
          <>
            <DatePicker
              {...datePickerA11y}
              key={`${dateInputId}-${dateTimeValue}`}
              id={dateInputId}
              label={t('common:input.date')}
              locale={locale}
              value={date}
              icon={<FontAwesomeIcon icon="calendar" fixedWidth />}
              size={inputSize}
              onChange={handleDateChange}
              disabled={fixedTimestamp}
              clearable={datePickerClearable}
              dayStyle={dayStyle}
              firstDayOfWeek={firstDayOfWeekOverride}
              labelFormat={calendarLabelFormat}
            />
            <TimeInput
              key={`${timeInputId}-${dateTimeValue}`}
              id={timeInputId}
              label={t('common:input.time')}
              value={date}
              icon={<FontAwesomeIcon icon="clock" fixedWidth />}
              size={inputSize}
              onChange={handleTimeChange}
              withSeconds
              format={timeFormat}
              disabled={fixedTimestamp}
              clearable
              classNames={timeInputClassNames}
              amLabel={amLabel}
              pmLabel={pmLabel}
            />
          </>
        ) : combinedInput ? (
          <CombinedDateTimeInput
            label={t('common:input.datetime')}
            value={dateString && timeString ? `${dateString}T${timeString}` : ''}
            id={dateTimeInputId}
            onChange={handleDateTimeChange}
            readOnly={fixedTimestamp}
            size={inputSize}
            className={styles.combinedInput}
          />
        ) : (
          <>
            <DateTimeInput
              id={dateInputId}
              label={t('common:input.date')}
              type="date"
              value={dateString}
              icon="calendar"
              onChange={handleDateChange}
              readOnly={fixedTimestamp}
              size={inputSize}
            />
            <DateTimeInput
              id={timeInputId}
              label={t('common:input.time')}
              type="time"
              value={timeString}
              icon="clock"
              onChange={handleTimeChange}
              readOnly={fixedTimestamp}
              size={inputSize}
            />
          </>
        )}
        {largeInputs && (
          <span className={classNames(styles.inputSelectorWrap)}>
            <InputSettings
              separateInputsEnabled={!combinedInput}
              customInputEnabled={customInput}
              toggleSeparateInputs={toggleSeparateInputs}
              toggleCustomInput={toggleCustomInput}
            />
          </span>
        )}
      </Group>
      <Select
        label={t('common:input.timezone')}
        value={timezone}
        data={timezoneNames}
        size={inputSize}
        placeholder={defaultTimezone}
        onChange={handleTimezoneChange}
        className="w-100"
        clearable
        searchable
        disabled={fixedTimestamp}
      />
      <Group align="end">
        <ButtonsComponent size={inputSize}>
          {!largeInputs && (
            <InputSettings
              separateInputsEnabled={!combinedInput}
              customInputEnabled={customInput}
              toggleSeparateInputs={toggleSeparateInputs}
              toggleCustomInput={toggleCustomInput}
              size={inputSize}
            />
          )}
        </ButtonsComponent>
      </Group>
    </Group>
  );
};

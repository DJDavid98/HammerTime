import { Group, MantineSize, Select } from '@mantine/core';
import classNames from 'classnames';
import { useLocalSettings } from 'components/contexts/LocalSettingsProvider';
import { IconRenderer } from 'components/IconRenderer';
import { TimestampInputBrowser } from 'components/input/TimestampInputBrowser';
import { TimestampInputCustom } from 'components/input/TimestampInputCustom';
import { TimezoneSelectItem } from 'components/input/TimezoneSelectItem';
import { TFunction } from 'i18next';
import styles from 'modules/TimestampPicker.module.scss';
import moment from 'moment';
import { FC, FunctionComponent, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { InputChangeHandler, TimestampInputProps } from 'src/model/timestamp-input-props';
import { getTimezoneValue, isoFormattingDateFormat, isoTimeFormat, momentToTimeInputValue } from 'src/util/timezone';

interface TimezoneOptionType {
  label: string;
  value: string;
}

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
  tzNames: string[];
  ButtonsComponent: FunctionComponent<PropsWithChildren<{ size: MantineSize }>>;
}

export const TimestampPicker: FC<PropTypes> = ({
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
  tzNames,
  ButtonsComponent,
}) => {
  const handleTimezoneChange = useCallback(
    (selected: TimezoneOptionType['value'] | null) => {
      changeTimezone(selected);
    },
    [changeTimezone],
  );
  const [inputSize, setInputSize] = useState<MantineSize>(largeInputSize);
  const { customInputEnabled, combinedInputsEnabled } = useLocalSettings();
  const timezoneNames: TimezoneOptionType[] = useMemo(() => tzNames.map((zoneName) => getTimezoneValue(zoneName)), [tzNames]);
  useEffect(() => {
    const inputSizeQuery = window.matchMedia(`(min-width: ${largeInputThreshold}px)`);
    const updateInputSizes = (e: Pick<MediaQueryListEvent, 'matches'>) => {
      setInputSize(e.matches ? largeInputSize : smallInputSize);
    };

    inputSizeQuery.addEventListener('change', updateInputSizes);
    updateInputSizes(inputSizeQuery);
    return () => inputSizeQuery.removeEventListener('change', updateInputSizes);
  }, []);

  const handleDateChange: InputChangeHandler = useCallback(
    (value) => {
      onDateChange(value && (value instanceof Date ? momentToTimeInputValue(moment(value), isoFormattingDateFormat) : value.target.value));
    },
    [onDateChange],
  );
  const handleTimeChange: InputChangeHandler = useCallback(
    (value) => {
      onTimeChange(value && (value instanceof Date ? momentToTimeInputValue(moment(value), isoTimeFormat) : value.target.value));
    },
    [onTimeChange],
  );
  const handleDateTimeChange: InputChangeHandler = useCallback(
    (value) => {
      onDateTimeChange(
        value &&
          (value instanceof Date
            ? momentToTimeInputValue(moment(value), `${isoFormattingDateFormat} ${isoTimeFormat}`)
            : value?.target.value),
      );
    },
    [onDateTimeChange],
  );

  const TimestampInput: FC<TimestampInputProps> = useMemo(
    () => (customInputEnabled ? TimestampInputCustom : TimestampInputBrowser),
    [customInputEnabled],
  );

  return (
    <Group align="end" className={styles['timestamp-picker']}>
      <Group align="end" className={classNames(styles['datetime-picker-wrap'], { [styles['combined-input-wrap']]: combinedInputsEnabled })}>
        <TimestampInput
          combinedInput={!!combinedInputsEnabled}
          t={t}
          locale={locale}
          dateString={dateString}
          timeString={timeString}
          timezone={timezone}
          inputSize={inputSize}
          language={language}
          fixedTimestamp={fixedTimestamp}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleDateTimeChange={handleDateTimeChange}
        />
      </Group>
      <Select
        label={t('common:input.timezone')}
        value={fixedTimestamp ? null : timezone ?? null}
        data={timezoneNames}
        size={inputSize}
        placeholder={fixedTimestamp ? 'GMT (UTC)' : defaultTimezone}
        onChange={handleTimezoneChange}
        className="w-100"
        clearable
        searchable
        disabled={fixedTimestamp}
        icon={<IconRenderer icons="globe" />}
        itemComponent={TimezoneSelectItem}
      />
      <Group align="end">
        <ButtonsComponent size={inputSize} />
      </Group>
    </Group>
  );
};

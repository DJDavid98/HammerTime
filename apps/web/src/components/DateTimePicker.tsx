import { ChangeEventHandler, Fragment, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import styles from './DateTimePicker.module.scss';
import { isValidTimestamp } from '../util/timezone';
import dayjs from '@hammertime/dayjs';
import { useTimestampContext } from '../contexts/TimestampContext';
import { useTimezoneContext } from '../contexts/TimezoneContext';
import { useTranslation } from 'next-i18next';

export const DateTimePicker: FunctionComponent = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [timestamp, setTimestamp] = useTimestampContext();
  const [timezone] = useTimezoneContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      console.log('e.target.value', e.target.value);
      setValue(dayjs.tz(parseInt(e.target.value, 10) * 1000, timezone).unix());
    },
    [timezone],
  );

  useEffect(() => {
    inputRef.current?.setCustomValidity(isValidTimestamp(value) ? '' : t('inputs:timestamp.invalid'));
  }, [value, t]);

  useEffect(() => {
    const isValid = isValidTimestamp(value);
    if (isValid) {
      setTimestamp(value);
    }
  }, [setTimestamp, value]);

  useEffect(() => {
    setValue(timestamp);
  }, [timestamp]);

  return (
    <Fragment>
      <input
        type="number"
        name="timestamp"
        step="1"
        value={timestamp}
        onChange={handleChange}
        className={styles.dateTimePicker}
        ref={inputRef}
      />
    </Fragment>
  );
};

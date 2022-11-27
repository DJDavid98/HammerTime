import { ChangeEventHandler, Fragment, FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TimezonePicker.module.scss';
import { isValidTimestamp } from '../util/timezone';
import dayjs from '@hammertime/dayjs';
import { useTimestampContext } from '../contexts/TimestampContext';
import { useTimezoneContext } from '../contexts/TimezoneContext';

export const DateTimePicker: FunctionComponent = () => {
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
    inputRef.current?.setCustomValidity(isValidTimestamp(value) ? '' : 'Invalid timestamp');
  }, [value]);

  useEffect(() => {
    const isValid = isValidTimestamp(value);
    console.log('DateTimePicker isValid', isValid);
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
        className={styles.timezonePicker}
        ref={inputRef}
      />
    </Fragment>
  );
};

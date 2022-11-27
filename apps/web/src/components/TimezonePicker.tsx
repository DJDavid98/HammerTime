import { ChangeEventHandler, Fragment, FunctionComponent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { TimezoneDatalist } from './TimezoneDatalist';
import styles from './TimezonePicker.module.scss';
import { isValidTimezone } from '../util/timezone';
import { useTimezoneContext } from '../contexts/TimezoneContext';

export const TimezonePicker: FunctionComponent = () => {
  const [value, setValue] = useState<string>('');
  const datalistId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [timezone, setTimezone] = useTimezoneContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setTimezone(e.target.value);
    },
    [setTimezone],
  );

  useEffect(() => {
    inputRef.current?.setCustomValidity(isValidTimezone(value) ? '' : 'Invalid timezone');
  }, [setTimezone, value]);

  useEffect(() => {
    const isValid = isValidTimezone(value);
    if (isValid) {
      setTimezone(value);
    }
  }, [setTimezone, value]);

  useEffect(() => {
    setValue(timezone);
  }, [timezone]);

  return (
    <Fragment>
      <input
        type="text"
        name="timezone"
        list={datalistId}
        value={value}
        onChange={handleChange}
        className={styles.timezonePicker}
        ref={inputRef}
      />
      <TimezoneDatalist id={datalistId} />
    </Fragment>
  );
};

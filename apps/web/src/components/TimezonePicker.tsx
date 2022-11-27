import { ChangeEventHandler, Fragment, useCallback, useId, useRef, useState } from 'react';
import { TimezoneDatalist } from './TimezoneDatalist';

export const TimezonePicker = () => {
  const [value, setValue] = useState<string>('');
  const datalistId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <Fragment>
      <input type="text" name="timezone" list={datalistId} value={value} onChange={handleChange} ref={inputRef} />
      <TimezoneDatalist id={datalistId} />
    </Fragment>
  );
};

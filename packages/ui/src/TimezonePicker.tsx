import { ChangeEventHandler, useCallback, useId, useState } from "react";
import { TimezoneDatalist } from "./TimezoneDatalist";

export const TimezonePicker = () => {
  const [value, setValue] = useState<string>('');
  const datalistId = useId();

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return <>
    <input type="text" name="timezone" list={datalistId} value={value} onChange={handleChange} />
    <TimezoneDatalist id={datalistId} />
  </>
};

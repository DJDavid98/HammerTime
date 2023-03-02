import { BrowserInput, DateTimeInputProps } from 'components/input/BrowserInput';
import { FC } from 'react';
import { dateTimeInputIcons } from 'src/model/timestamp-input-props';

export const BrowserInputCombined: FC<Omit<DateTimeInputProps, 'type' | 'icon'>> = (props) => (
  <BrowserInput {...props} type="datetime-local" icon={dateTimeInputIcons} />
);

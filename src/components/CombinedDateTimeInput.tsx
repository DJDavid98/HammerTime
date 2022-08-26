import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DateTimeInput, DateTimeInputProps } from 'components/DateTimeInput';
import { FC } from 'react';

const icons: IconProp[] = ['calendar', 'clock'];

export const CombinedDateTimeInput: FC<Omit<DateTimeInputProps, 'type' | 'icon'>> = (props) => (
  <DateTimeInput {...props} type="datetime-local" icon={icons} />
);

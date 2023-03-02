import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MantineSize } from '@mantine/core';
import { ChangeEvent } from 'react';
import { TFunction } from 'react-i18next';

export type InputChangeHandler = (value: Date | ChangeEvent<HTMLInputElement> | null) => void;

export interface TimestampInputProps {
  combinedInput: boolean;
  t: TFunction;
  locale: string;
  dateString: string;
  timeString: string;
  language: string;
  inputSize: MantineSize;
  fixedTimestamp: boolean;
  handleDateChange: InputChangeHandler;
  handleTimeChange: InputChangeHandler;
  handleDateTimeChange: InputChangeHandler;
}

export const dateInputIcon: IconProp = 'calendar';
export const timeInputIcon: IconProp = 'clock';
export const dateTimeInputIcons: IconProp[] = [dateInputIcon, timeInputIcon];

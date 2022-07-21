import { MantineProviderProps } from '@mantine/core';
import { MonthSettings } from '@mantine/dates';
import rtlPlugin from 'stylis-plugin-rtl';

export const getEmotionProps = (dir: 'rtl' | 'ltr'): MantineProviderProps['emotionOptions'] => ({
  key: dir,
  stylisPlugins: dir === 'rtl' ? [rtlPlugin] : undefined,
});

const discordColor = '#5865f2';

const createColorArray = (value: string): [string, string, string, string, string, string, string, string, string, string] => [
  value,
  value,
  value,
  value,
  value,
  value,
  value,
  value,
  value,
  value,
];

export const themeOverride: MantineProviderProps['theme'] = {
  colors: {
    discord: createColorArray(discordColor),
  },
  colorScheme: 'dark',
  fontFamily: `'Montserrat', sans-serif`,
  fontFamilyMonospace: `'Source Code Pro', 'Consolas', monospace`,
  primaryColor: 'indigo',
  dateFormat: 'LL',
};

export const styleOverride: MantineProviderProps['styles'] = {
  Button: (theme) => ({
    root: {
      'padding': '0 .9em',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '&:not(.__mantine-ref-loading):disabled': {
        color: theme.colors.indigo[2],
      },
    },
  }),
};

export const getDayStyle =
  (theme: Required<MantineProviderProps>['theme'], today: Date): MonthSettings['dayStyle'] =>
  (date) => {
    const dateString = date.toDateString();
    const todayString = today.toDateString();
    return dateString === todayString
      ? {
          border: `2px solid ${theme.colors?.indigo?.[4] || ''}`,
          boxSizing: 'border-box',
        }
      : {};
  };

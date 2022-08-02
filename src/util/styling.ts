import { MantineProviderProps, createEmotionCache } from '@mantine/core';
import { MonthSettings } from '@mantine/dates';
import rtlPlugin from 'stylis-plugin-rtl';

export const getEmotionCache = (dir: 'rtl' | 'ltr'): MantineProviderProps['emotionCache'] => {
  if (dir !== 'rtl') return undefined;

  return createEmotionCache({
    key: 'mantine-rtl',
    stylisPlugins: [rtlPlugin],
  });
};

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
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          'padding': '0 .9em',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '&:not(.__mantine-ref-loading):disabled': {
            color: theme.colors.indigo[2],
          },
        },
      }),
    },
  },
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

import { createEmotionCache, MantineProviderProps } from '@mantine/core';
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

const createColorArray = <T extends string>(value: T): [T, T, T, T, T, T, T, T, T, T] => [
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
  components: {
    /* eslint-disable @typescript-eslint/naming-convention */
    Button: {
      styles: (theme) => ({
        root: {
          'padding': '0 .9em',
          '&:not(.__mantine-ref-loading):disabled': {
            color: theme.colors.indigo[2],
          },
        },
      }),
    },
    Tooltip: {
      defaultProps: {
        color: 'dark',
      },
    },
    WeekdaysRow: {
      styles: () => ({ weekday: { 'text-transform': 'none' } }),
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  },
};

export const getDayStyle =
  (today: Date): MonthSettings['getDayProps'] =>
  (date) => {
    const dateString = date.toDateString();
    const todayString = today.toDateString();
    if (dateString === todayString) {
      return {
        sx: (theme) => ({
          border: `2px solid ${theme.colors?.indigo?.[4] || ''}`,
          boxSizing: 'border-box',
        }),
      };
    }

    return {};
  };

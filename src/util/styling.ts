import { MantineProviderProps } from '@mantine/core';
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
  Button: {
    root: {
      padding: '0 .9em',
    },
  },
};

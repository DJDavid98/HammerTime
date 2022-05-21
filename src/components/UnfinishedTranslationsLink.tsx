import { Button } from '@mantine/core';
import { VFC } from 'react';
import { CROWDIN_URL } from 'src/config';

export const UnfinishedTranslationsLink: VFC<{ percent: number; crowdinLocale: string }> = ({ percent, crowdinLocale }) => (
  <Button
    color="yellow"
    variant="outline"
    size="xs"
    component="a"
    href={`${CROWDIN_URL}/${crowdinLocale}`}
    target="_blank"
    rel="noreferrer noopener"
  >
    {percent}%
  </Button>
);

import { FC } from 'react';
import { CROWDIN_URL } from '../config';

export const UnfinishedTranslationsLink: FC<{ percent: number; crowdinLocale: string }> = ({ percent, crowdinLocale }) => (
  <a href={`${CROWDIN_URL}/${crowdinLocale}`} target="_blank" rel="noreferrer noopener">
    {percent}%
  </a>
);

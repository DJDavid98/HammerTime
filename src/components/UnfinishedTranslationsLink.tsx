import { VFC } from 'react';
import { Button } from 'reactstrap';
import { CROWDIN_URL } from 'src/config';

export const UnfinishedTranslationsLink: VFC<{ percent?: number; crowdinLocale: string }> = ({ percent, crowdinLocale }) => {
  if (typeof percent !== 'number') return null;

  return (
    <Button
      color="warning"
      outline
      size="sm"
      tag="a"
      className="mx-1"
      href={`${CROWDIN_URL}/${crowdinLocale}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {percent}%
    </Button>
  );
};

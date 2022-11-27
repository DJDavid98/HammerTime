import { FunctionComponent, memo } from 'react';
import { timeZonesNames } from '@vvo/tzdb';

const TimezoneDatalistComponent: FunctionComponent<{ id: string }> = ({ id }) => (
  <datalist id={id}>
    {timeZonesNames.map((name) => (
      <option key={name} value={name} />
    ))}
  </datalist>
);

export const TimezoneDatalist = memo(TimezoneDatalistComponent);

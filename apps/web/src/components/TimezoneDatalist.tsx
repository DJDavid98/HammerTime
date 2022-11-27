import { FunctionComponent, memo } from 'react';
import { useTimezoneNamesContext } from '../contexts/TimezoneNamesContext';

const TimezoneDatalistComponent: FunctionComponent<{ id: string }> = ({ id }) => {
  const zoneNames = useTimezoneNamesContext();
  return (
    <datalist id={id}>
      {zoneNames.map((name) => (
        <option key={name} value={name} />
      ))}
    </datalist>
  );
};

export const TimezoneDatalist = memo(TimezoneDatalistComponent);

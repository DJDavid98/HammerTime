import { useMemo, VoidFunctionComponent } from 'react';
import type { Props as FlagProps } from 'react-flagkit';
import Image from 'next/image';

export const CustomFlag: VoidFunctionComponent<FlagProps> = ({ country = 'US', role = 'img', size = 24, alt, ...props }) => {
  const flagImageSrc = useMemo(() => {
    switch (country) {
      case 'CA':
        return `/flags/${country}.svg`;
      default:
        return null;
    }
  }, [country]);

  if (!flagImageSrc) {
    return <span>{country}</span>;
  }

  return (
    <Image src={flagImageSrc} role={role} alt={alt ?? `${country} Flag`} height={size} width={size} {...props} placeholder={undefined} />
  );
};

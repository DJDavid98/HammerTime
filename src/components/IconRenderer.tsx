import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Fragment, useMemo } from 'react';

export const IconRenderer: FC<{ icons: IconProp | IconProp[] }> = ({ icons }) => {
  const iconsArray = useMemo(() => (Array.isArray(icons) ? (icons as IconProp[]) : [icons]), [icons]);
  return (
    <>
      {iconsArray.map((iconProp, i) => {
        const iconJsx = <FontAwesomeIcon key={i} icon={iconProp} />;
        return iconsArray.length === 1 || i === iconsArray.length - 1 ? iconJsx : <Fragment key={i}>{iconJsx}&nbsp;</Fragment>;
      })}
    </>
  );
};

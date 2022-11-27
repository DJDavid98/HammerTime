import classNames from 'classnames';
import { FC, memo } from 'react';

export interface CustomIconProps {
  src: string;
  alt?: string;
  className?: string;
}

const CustomIconComponent: FC<CustomIconProps> = ({ src, alt = '', className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} className={classNames(className, 'svg-inline--fa')} alt={alt} loading="lazy" />
);

export const CustomIcon = memo(CustomIconComponent);

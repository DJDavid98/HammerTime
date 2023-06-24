import styles from 'modules/LoadingIndicator.module.scss';
import { CSSProperties, FC, useMemo } from 'react';

interface LoadingIndicatorProps {
  size?: number;
  color?: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size = 32, color }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const style = useMemo(() => {
    const sizeRem = `${size / 16}rem`;
    return {
      width: sizeRem,
      height: sizeRem,
      color,
    } as CSSProperties;
  }, [color, size]);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className={styles.indicator} viewBox="0 0 64 64" style={style}>
      <path d="M35 32a3.001 3.001 0 0 1-6 0l3-26.074L35 32Z" className={styles.minute} />
      <path d="M35 32a3.001 3.001 0 0 1-6 0l3-13.037L35 32Z" className={styles.hour} />
      <g className={styles.base}>
        <circle cx="32" cy="32" r="29" className={styles.face} />
        <path d="M32 3v7m0 44v7m22-29h7M3 32h7" className={styles.ticking} />
      </g>
    </svg>
  );
};

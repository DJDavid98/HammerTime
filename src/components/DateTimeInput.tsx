import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, MantineSize } from '@mantine/core';
import { ChangeEventHandler, FC, useMemo } from 'react';

export interface DateTimeInputProps {
  id: string;
  label: string;
  value: string;
  className?: string;
  size: MantineSize;
  icon: IconProp | IconProp[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: 'date' | 'time' | 'datetime-local';
  readOnly?: boolean;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({ id, label, value, icon, onChange, type, readOnly, className, size }) => {
  const icons = useMemo(() => {
    const iconArray = (typeof icon === 'string' ? [icon] : icon) as IconProp[];
    if (size === 'sm' && iconArray.length > 1) {
      return iconArray.slice(0, 1);
    }
    return iconArray;
  }, [icon, size]);
  return (
    <Input.Wrapper label={label} size={size} className={className}>
      <Input
        type={type}
        size={size}
        id={id}
        value={value}
        step="1"
        onChange={onChange}
        disabled={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        icon={icons.map((iconProp, i) => {
          const iconJsx = <FontAwesomeIcon key={i} icon={iconProp} />;
          return icons.length === 1 || i === icons.length - 1 ? iconJsx : <>{iconJsx}&nbsp;</>;
        })}
      />
    </Input.Wrapper>
  );
};

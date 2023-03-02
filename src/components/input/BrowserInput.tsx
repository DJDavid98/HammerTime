import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Input, MantineSize } from '@mantine/core';
import { IconRenderer } from 'components/IconRenderer';
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

export const BrowserInput: FC<DateTimeInputProps> = ({ id, label, value, icon, onChange, type, readOnly, className, size }) => {
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
        icon={<IconRenderer icons={icons} />}
      />
    </Input.Wrapper>
  );
};

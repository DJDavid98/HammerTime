import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Input, MantineSize } from '@mantine/core';
import { IconRenderer } from 'components/IconRenderer';
import { ChangeEventHandler, FC, useMemo } from 'react';
import { useWithSeconds } from 'src/hooks/useWithSeconds';
import { removeSecondsFromTimeString } from 'src/util/common';

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
  const withSeconds = useWithSeconds();
  const typeContainsTime = useMemo(() => type.includes('time'), [type]);
  const step = useMemo(() => (withSeconds && typeContainsTime ? '1' : undefined), [withSeconds, typeContainsTime]);
  const saferValue = useMemo(
    () => (typeContainsTime ? removeSecondsFromTimeString(value, withSeconds) : value),
    [typeContainsTime, value, withSeconds],
  );
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
        value={saferValue}
        step={step}
        onChange={onChange}
        disabled={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        icon={<IconRenderer icons={icons} />}
      />
    </Input.Wrapper>
  );
};

import { Text } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

interface ItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}

export const TimezoneSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Text size="sm">{label}</Text>
  </div>
));

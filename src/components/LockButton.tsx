import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, MantineSize, Tooltip } from '@mantine/core';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';

const RawLockButton: ForwardRefRenderFunction<
  HTMLAnchorElement,
  { fixedTimestamp: boolean; href?: string; lockButtonTooltipText: string; size: MantineSize }
> = ({ fixedTimestamp, href, lockButtonTooltipText, size }, ref) => (
  <Tooltip label={lockButtonTooltipText}>
    <Button component="a" href={href} size={size} color={fixedTimestamp ? 'red' : 'blue'} ref={ref}>
      <FontAwesomeIcon icon={fixedTimestamp ? 'unlock' : 'lock'} />
    </Button>
  </Tooltip>
);

export const LockButton = forwardRef(RawLockButton);

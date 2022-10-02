import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, MantineSize, Tooltip } from '@mantine/core';
import { NextLink } from '@mantine/next';
import React, { FC } from 'react';

export const LockButton: FC<{ fixedTimestamp: boolean; href: string; lockButtonTooltipText: string; size: MantineSize }> = ({
  fixedTimestamp,
  href,
  lockButtonTooltipText,
  size,
}) => (
  <Tooltip label={lockButtonTooltipText}>
    <Button component={NextLink} href={href} size={size} color={fixedTimestamp ? 'red' : 'blue'}>
      <FontAwesomeIcon icon={fixedTimestamp ? 'unlock' : 'lock'} />
    </Button>
  </Tooltip>
);

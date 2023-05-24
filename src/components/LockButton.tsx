import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, MantineSize, Tooltip } from '@mantine/core';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

export const LockButton: FC<{ fixedTimestamp: boolean; href: string; lockButtonTooltipText: ReactNode; size: MantineSize }> = ({
  fixedTimestamp,
  href,
  lockButtonTooltipText,
  size,
}) => (
  <Tooltip label={lockButtonTooltipText}>
    <Link href={href} passHref>
      <Button size={size} color={fixedTimestamp ? 'red' : 'blue'}>
        <FontAwesomeIcon icon={fixedTimestamp ? 'unlock' : 'lock'} />
      </Button>
    </Link>
  </Tooltip>
);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, MantineSize, Tooltip } from '@mantine/core';
import Link from 'next/link';
import React, { FC, useRef } from 'react';

export const LockButton: FC<{ fixedTimestamp: boolean; href: string; lockButtonTooltipText: string; size: MantineSize }> = ({
  fixedTimestamp,
  href,
  lockButtonTooltipText,
  size,
}) => {
  const buttonRef = useRef(null);
  return (
    <Link href={href} passHref ref={buttonRef}>
      <Tooltip label={lockButtonTooltipText} ref={buttonRef}>
        <Button size={size} color={fixedTimestamp ? 'red' : 'blue'} ref={buttonRef}>
          <FontAwesomeIcon icon={fixedTimestamp ? 'unlock' : 'lock'} />
        </Button>
      </Tooltip>
    </Link>
  );
};

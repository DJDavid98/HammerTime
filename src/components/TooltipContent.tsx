import { FC, useEffect } from 'react';

interface TooltipContentProps {
  update: VoidFunction;
}

export const TooltipContent: FC<TooltipContentProps> = ({ update, children }) => {
  useEffect(() => {
    update();
  }, [update, children]);

  return <>{children}</>;
};

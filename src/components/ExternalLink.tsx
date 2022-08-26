import { Anchor } from '@mantine/core';
import classNames from 'classnames';
import React, { ComponentType, ElementType, forwardRef, ForwardRefRenderFunction, memo, ReactNode, ReactNodeArray } from 'react';

export interface ExternalLinkProps {
  children?: ReactNode | ReactNodeArray;
  href: string;
  tag?: string | ElementType | ComponentType<{ href?: string; title?: string; className?: string }>;
  blank?: boolean;
  className?: string;
  title?: string;
  rel?: string;
  ref?: string;
}

const ExternalLinkComponent: ForwardRefRenderFunction<HTMLAnchorElement, ExternalLinkProps> = (
  { children, href, className, blank = true, title, rel },
  ref,
) => {
  const targetProps = blank
    ? {
        target: '_blank',
        rel: classNames(rel, 'noopener noreferrer'),
      }
    : { rel };
  return (
    <Anchor {...targetProps} href={href} className={className} title={title} ref={ref}>
      {children}
    </Anchor>
  );
};

export const ExternalLink = memo(forwardRef(ExternalLinkComponent));

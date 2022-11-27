import classNames from 'classnames';
import React, { ComponentType, ElementType, forwardRef, ForwardRefRenderFunction, memo, PropsWithChildren } from 'react';
import Link from 'next/link';

export interface ExternalLinkProps {
  href: string;
  tag?: string | ElementType | ComponentType<{ href?: string; title?: string; className?: string }>;
  blank?: boolean;
  className?: string;
  title?: string;
  rel?: string;
  ref?: string;
}

const ExternalLinkComponent: ForwardRefRenderFunction<HTMLAnchorElement, PropsWithChildren<ExternalLinkProps>> = (
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
    <Link {...targetProps} href={href} className={className} title={title} ref={ref}>
      {children}
    </Link>
  );
};

export const ExternalLink = memo(forwardRef(ExternalLinkComponent));

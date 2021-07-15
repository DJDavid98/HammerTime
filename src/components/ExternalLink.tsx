import classNames from 'classnames';
import React, { ComponentType, ElementType, forwardRef, ForwardRefRenderFunction, memo, ReactNode, ReactNodeArray } from 'react';
import { Nullable } from 'src/types/common';

export interface ExternalLinkProps {
  children?: ReactNode | ReactNodeArray;
  href: string;
  tag?: string | ElementType | ComponentType<{ href?: string; title?: string; className?: string }>;
  blank?: boolean;
  className?: string;
  title?: string;
  rel?: Nullable<string>;
  ref?: string;
}

const ExternalLinkComponent: ForwardRefRenderFunction<HTMLAnchorElement, ExternalLinkProps> = (
  { children, tag = null, href, className, blank = true, title, rel = null },
  ref,
) => {
  const Tag = tag || 'a';
  const targetProps = blank
    ? {
        target: '_blank',
        rel: classNames(rel, 'noopener noreferrer'),
      }
    : { rel };
  const additionalProps = { ...targetProps, ref };
  return (
    <Tag href={href} className={className} title={title} {...additionalProps}>
      {children}
    </Tag>
  );
};

export const ExternalLink = memo(forwardRef(ExternalLinkComponent));

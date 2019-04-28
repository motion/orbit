import { SimpleText, SimpleTextProps } from '@o/ui'
import React from 'react'

import { useLink } from '../pages/HomePage/linkProps'
import { LinkText } from './Header'

export type LinkProps = SimpleTextProps & {
  href?: string
  external?: boolean
}

export function Link({ children, fontSize = 16, href, width, margin, ...props }: LinkProps) {
  const { isActive, ...linkProps } = useLink(href)
  return (
    <LinkText cursor="pointer" {...linkProps} fontSize={fontSize} width={width} margin={margin}>
      <SimpleText
        fontSize={fontSize}
        alpha={isActive ? 1 : 0.6}
        fontWeight={300}
        fontFamily="GT Eesti"
        hoverStyle={{ alpha: 1 }}
        activeStyle={{ alpha: isActive ? 1 : 0.7 }}
        transition="all ease 300ms"
        {...props}
      >
        {children}
      </SimpleText>
    </LinkText>
  )
}

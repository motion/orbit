import { SimpleText, SimpleTextProps } from '@o/ui'
import React from 'react'

import { fontProps } from '../constants'
import { useLink } from '../useLink'
import { LinkText } from './LinkText'

export type LinkProps = SimpleTextProps & {
  href?: string
  external?: boolean
}

export function Link({ children, href, fontSize, width, margin, ...props }: LinkProps) {
  const { isActive, ...linkProps } = useLink(href)
  return (
    <LinkText cursor="pointer" width={width} margin={margin}>
      <SimpleText
        tagName="a"
        fontSize={fontSize}
        coat="simpleBlue"
        alpha={isActive ? 1 : 0.7}
        hoverStyle={{ alpha: 1 }}
        activeStyle={{ alpha: isActive ? 1 : 0.7 }}
        transition="all ease 300ms"
        {...linkProps}
        {...fontProps.BodyFont}
        {...props}
      >
        {children}
      </SimpleText>
    </LinkText>
  )
}
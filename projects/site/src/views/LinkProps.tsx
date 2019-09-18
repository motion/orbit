import { SimpleText, SimpleTextProps } from '@o/ui'
import React from 'react'

import { fontProps } from '../constants'
import { useLink } from '../useLink'
import { LinkText } from './LinkText'

export type LinkProps = SimpleTextProps & {
  href?: string
  external?: boolean
}

export function Link({ children, fontSize, href, width, margin, ...props }: LinkProps) {
  const { isActive, ...linkProps } = useLink(href)
  return (
    <LinkText cursor="pointer" {...linkProps} fontSize={fontSize} width={width} margin={margin}>
      <SimpleText
        fontSize={fontSize || 'inherit'}
        alpha={isActive ? 1 : 0.7}
        hoverStyle={{ alpha: 1 }}
        activeStyle={{ alpha: isActive ? 1 : 0.7 }}
        transition="all ease 300ms"
        {...fontProps.BodyFont}
        {...props}
      >
        {children}
      </SimpleText>
    </LinkText>
  )
}

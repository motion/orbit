import * as React from 'react'
import { SizedSurface } from '../SizedSurface'
import { Text } from '../Text'

export const Label = ({
  children,
  alignItems = 'center',
  justifyContent = 'center',
  textProps,
  ...props
}) => (
  <SizedSurface
    borderRadius
    sizeHeight
    sizePadding={1.5}
    justifyContent={justifyContent}
    alignItems={alignItems}
    borderWidth={1}
    noElement
    noWrap
    background="transparent"
    tagName="label"
    {...props}
  >
    <Text style={{ justifyContent, alignItems }} ellipse {...textProps}>
      {children === true ? ' ' : children}
    </Text>
  </SizedSurface>
)

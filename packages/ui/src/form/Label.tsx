import * as React from 'react'
import { SizedSurface } from '../SizedSurface'
import { Text } from '../Text'

export const Label = ({
  children,
  alignItems,
  justifyContent,
  textProps,
  ...props
}) => (
  <SizedSurface
    sizeRadius
    sizeHeight
    sizePadding={1.5}
    justifyContent={justifyContent}
    alignItems={alignItems}
    borderWidth={1}
    background="transparent"
    tagName="label"
    {...props}
  >
    <Text style={{ justifyContent, alignItems }} ellipse {...textProps}>
      {children === true ? ' ' : children}
    </Text>
  </SizedSurface>
)

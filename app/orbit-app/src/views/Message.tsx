import * as React from 'react'
import { SizedSurface, Text } from '@mcro/ui'

export const Message = ({ children, textProps, ...props }) => (
  <SizedSurface sizePadding sizeRadius {...props}>
    <Text {...textProps}>{children}</Text>
  </SizedSurface>
)

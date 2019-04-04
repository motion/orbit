import React from 'react'
import { Text } from './Text'

export function Title({ size = 1.5, verticalSpacing = 1, children, ...props }) {
  return (
    <Text
      size={size}
      fontWeight={700}
      margin={[5 * verticalSpacing, 0, 10 * verticalSpacing]}
      {...props}
    >
      {children}
    </Text>
  )
}

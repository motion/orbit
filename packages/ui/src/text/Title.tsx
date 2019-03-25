import React from 'react'
import { Text } from './Text'

export function Title({ verticalSpacing = 1, children, ...props }) {
  return (
    <Text
      size={1.5}
      fontWeight={700}
      margin={[5 * verticalSpacing, 0, 10 * verticalSpacing]}
      {...props}
    >
      {children}
    </Text>
  )
}

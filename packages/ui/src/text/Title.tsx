import React from 'react'
import { Text } from './Text'

export const Title = ({ verticalSpacing = 1, children, ...props }) => (
  <Text
    size={1.5}
    fontWeight={700}
    margin={[5 * verticalSpacing, 0, 10 * verticalSpacing]}
    {...props}
  >
    {children}
  </Text>
)

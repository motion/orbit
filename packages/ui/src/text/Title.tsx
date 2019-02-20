import React from 'react'
import { Text } from './Text'

export const Title = ({ verticalSpacing = 1, children, ...props }) => (
  <Text size={1.35} fontWeight={700} margin={[0, 0, 12 * verticalSpacing]} {...props}>
    {children}
  </Text>
)

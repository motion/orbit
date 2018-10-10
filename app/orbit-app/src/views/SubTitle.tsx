import * as React from 'react'
import { Text } from '@mcro/ui'

export const SubTitle = ({ verticalSpacing = 1, children, ...props }) => (
  <Text
    alpha={0.65}
    fontWeight={300}
    size={1.1}
    alignItems="center"
    flexFlow="row"
    padding={[3 * verticalSpacing, 0, 10 * verticalSpacing]}
    opacity={0.75}
    {...props}
  >
    {children}
  </Text>
)

import { Text } from '@mcro/ui'
import * as React from 'react'

export const SubTitle = ({ verticalSpacing = 1, children, ...props }) => (
  <Text
    alpha={0.75}
    fontWeight={300}
    size={1.2}
    alignItems="center"
    flexFlow="row"
    padding={[3 * verticalSpacing, 0, 10 * verticalSpacing]}
    {...props}
  >
    {children}
  </Text>
)

import * as React from 'react'
import { Text } from './Text'

export const SubTitle = ({ verticalSpacing = 1, children, ...props }) => (
  <Text
    alpha={0.75}
    fontWeight={300}
    size={1.2}
    alignItems="center"
    flexFlow="row"
    margin={[3 * verticalSpacing, 0, 10 * verticalSpacing]}
    {...props}
  >
    {children}
  </Text>
)

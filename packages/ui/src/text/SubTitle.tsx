import * as React from 'react'

import { Config } from '../helpers/configureUI'
import { Text } from './Text'

export function SubTitle({ verticalSpacing = 1, children, ...props }) {
  return (
    <Text
      alpha={0.6}
      fontWeight={300}
      size={1.1}
      alignItems="center"
      flexFlow="row"
      margin={[3 * verticalSpacing, 0, 5 * verticalSpacing]}
      {...Config.defaultProps.title}
      {...props}
    >
      {children}
    </Text>
  )
}

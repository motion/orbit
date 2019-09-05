import * as React from 'react'

import { Config } from '../helpers/configureUI'
import { Text, TextProps } from './Text'

export type SubTitleProps = TextProps

export function SubTitle(props: SubTitleProps) {
  return (
    <Text
      alpha={0.6}
      fontWeight={300}
      size={1.1}
      alignItems="center"
      flexDirection="row"
      {...Config.defaultProps.title}
      {...props}
    />
  )
}

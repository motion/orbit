import React from 'react'

import { Config } from '../helpers/configureUI'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export const Title = ({ size, children, ...props }: TitleProps) => {
  return (
    <Text
      className="ui-title"
      fontWeight={700}
      {...Config.defaultProps.title}
      size={size}
      sizeFont={2}
      sizeLineHeight={1.25}
      {...props}
    >
      {children}
    </Text>
  )
}

import React from 'react'

import { Config } from '../helpers/configureUI'
import { getTextSize } from '../Sizes'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  const sz = getTextSize(size) * 1.4 + 0.75
  const sizeLineHeight = Math.max(0.1, sz * 0.15 - 1) + sz * 0.075 + 0.9
  return (
    <Text
      className="ui-title"
      fontWeight={700}
      {...Config.defaultProps.title}
      size={sz}
      sizeLineHeight={sizeLineHeight}
      {...props}
    >
      {children}
    </Text>
  )
}

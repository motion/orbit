import React from 'react'
import { Config } from '../helpers/configure'
import { getTextSize } from '../Sizes'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  const sz = getTextSize(size) * 1.4 + 0.75
  const sizeLineHeight = Math.max(0.1, sz * 0.15 - 1) + sz * 0.075 + 0.9
  return (
    <Text
      {...Config.titleDefaultProps}
      size={sz}
      sizeLineHeight={sizeLineHeight}
      fontWeight={700}
      {...props}
    >
      {children}
    </Text>
  )
}

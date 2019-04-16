import React from 'react'
import { getTextSize } from '../Sizes'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  const sz = getTextSize(size) * 1.4 + 0.75
  const sizeLineHeight = Math.max(0.1, sz * 0.1 - 1) + sz * 0.15 + 0.6
  return (
    <Text size={sz} sizeLineHeight={sizeLineHeight} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

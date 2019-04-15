import React from 'react'
import { getTextSize } from '../Sizes'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  const sz = getTextSize(size) * 1.4 + 0.75
  return (
    <Text size={sz} sizeLineHeight={sz * 0.35} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

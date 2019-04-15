import React from 'react'
import { getTextSize } from '../Sizes'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  return (
    <Text size={getTextSize(size) * 1.5 + 1} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

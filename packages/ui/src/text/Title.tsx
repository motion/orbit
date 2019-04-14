import React from 'react'
import { getTextSize, Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  return (
    <Text size={getTextSize(size) * 2} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

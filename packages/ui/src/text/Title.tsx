import React from 'react'
import { getTextSize, Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  return (
    <Text size={getTextSize(size) * 1.5} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

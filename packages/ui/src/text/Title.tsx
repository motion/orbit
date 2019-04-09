import React from 'react'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export function Title({ size = 'xl', children, ...props }: TitleProps) {
  return (
    <Text size={size} fontWeight={700} {...props}>
      {children}
    </Text>
  )
}

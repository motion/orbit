import React from 'react'

import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export const Title = (props: TitleProps) => (
  <Text className="ui-title" fontWeight={700} sizeFont={2} {...props} />
)

import { Image, TextProps } from '@o/ui'
import React from 'react'

import markSolid from '../../public/images/mark-solid.svg'
import { Text } from './Text'

export const IntroText = (props: TextProps) => (
  <Text size={1.8} sizeLineHeight={1.3} style={{}}>
    {props.children}
    <Image
      src={markSolid}
      display="inline"
      width={16}
      height={16}
      transform={{
        y: -2,
      }}
      margin={[-2, 8]}
      userSelect="none"
    />
  </Text>
)

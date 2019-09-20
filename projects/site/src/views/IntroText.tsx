import { Image, TextProps } from '@o/ui'
import React from 'react'

import markSolid from '../public/images/mark-solid.svg'
import { Text } from './Text'

export const IntroText = (props: TextProps) => {
  const words = `${props.children}`.split(' ')
  const allButLast = words.slice(0, words.length - 1).join(' ')
  const last = words[words.length - 1]
  return (
    <Text size={1.5} sizeLineHeight={1.35} fontWeight={400} width="100%">
      {allButLast}{' '}
      <span style={{ display: 'inline-block' }}>
        {last}
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
      </span>
    </Text>
  )
}

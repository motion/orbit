import { gloss } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { Row, Text, TextProps } from '@mcro/ui'
import * as React from 'react'

export const HorizontalScroll = gloss(Row, {
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  alignItems: 'center',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const IntroText = (props: TextProps) => <Text size={1.2} alpha={0.8} {...props} />

export const Link = props => (
  <UI.Text cursor="pointer" fontWeight={400} color="#8b2bec" display="inline" {...props} />
)

export const AppWrapper = gloss(UI.Col, {
  // background: [0, 0, 0, 0.1],
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  position: 'relative',
  pointerEvents: 'auto',
})

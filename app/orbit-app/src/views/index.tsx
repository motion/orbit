import { gloss } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { Row, SubTitle, Text, TextProps, Title } from '@mcro/ui'
import * as React from 'react'

export * from './RoundButton'

export const highlightColor = UI.color('#696549')

export const SuggestionBarVerticalPad = gloss({
  height: 24,
  pointerEvents: 'none',
})

export const SmallVerticalSpace = gloss({
  height: 10,
})

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

export const SubPaneTitle = props => {
  return <Title marginLeft={12} marginRight={12} {...props} />
}

export const SubPaneSubTitle = props => {
  return <SubTitle marginLeft={12} marginRight={12} {...props} />
}

export const SubPaneSection = gloss({
  padding: [0, 12],
})

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

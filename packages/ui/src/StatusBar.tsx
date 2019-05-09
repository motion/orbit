import { gloss, Row } from 'gloss'
import * as React from 'react'
import { RoundButtonSmall } from './buttons/RoundButtonSmall'
import { Text } from './text/Text'
import { View } from './View/View'

const statusBarProps = {
  alignItems: 'center',
  alpha: 0.7,
  size: 0.95,
}

export const StatusBar = gloss(View, {
  padding: [0, 7],
  height: 34,
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
  // backdropFilter: 'blur(10px)',
}).theme((_, theme) => ({
  background: theme.background.alpha(0.97),
  borderTop: [1, theme.borderColor.alpha(a => a * 0.75)],
  boxShadow: [[0, 0, 10, [0, 0, 0, 0.06]]],
}))

export const StatusBarSpace = gloss({
  width: 10,
})

export const StatusBarButton = props => (
  <RoundButtonSmall background="transparent" {...statusBarProps} {...props} />
)

export const StatusBarText = props => <Text {...statusBarProps} {...props} />

export const StatusBarSection = props => <Row alignItems="center" {...props} />

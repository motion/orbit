import { gloss } from '@mcro/gloss'
import { Row, Text } from '@mcro/ui'
import * as React from 'react'
import { RoundButtonSmall } from './RoundButtonSmall'

const statusBarProps = {
  alignItems: 'center',
  fontWeight: 500,
  alpha: 0.8,
  size: 1.2,
}

export const StatusBar = gloss({
  margin: 8,
  borderRadius: 7,
  padding: [0, 7],
  height: 38,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
  // backdropFilter: 'blur(10px)',
}).theme((_, theme) => ({
  background: theme.background.darken(0.1).alpha(0.97),
  border: [1, theme.borderColor.alpha(0.75)],
  boxShadow: [[0, 0, 18, [0, 0, 0, 0.26]]],
}))

export const StatusBarSpace = gloss({
  width: 10,
})

export const StatusBarButton = props => (
  <RoundButtonSmall background="transparent" {...statusBarProps} {...props} />
)

export const StatusBarText = props => <Text {...statusBarProps} {...props} />

export const StatusBarSection = props => <Row alignItems="center" {...props} />

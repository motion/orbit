import { gloss } from '@mcro/gloss'
import { Row, Text } from '@mcro/ui'
import * as React from 'react'
import { RoundButtonSmall } from './RoundButtonSmall'

export const StatusBar = gloss({
  margin: 7,
  borderRadius: 7,
  padding: [0, 4],
  height: 28,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
  boxShadow: [[0, 0, 8, [0, 0, 0, 0.025]]],
  // backdropFilter: 'blur(10px)',
}).theme((_, theme) => ({
  background: theme.background.alpha(0.98),
  border: [1, theme.borderColor.alpha(0.75)],
}))

StatusBar.Space = gloss({
  width: 10,
})

const AppStatusBarTextProps = {
  alignItems: 'center',
  fontWeight: 400,
  alpha: 0.8,
  fontSize: 12,
}

StatusBar.Button = props => (
  <RoundButtonSmall background="transparent" {...AppStatusBarTextProps} {...props} />
)

StatusBar.Text = props => <Text {...AppStatusBarTextProps} {...props} />

StatusBar.Section = props => <Row alignItems="center" {...props} />

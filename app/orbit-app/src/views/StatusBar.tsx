import * as React from 'react'
import { Row, Text } from '@mcro/ui'
import { RoundButton } from '.'
import { gloss } from '@mcro/gloss'

export const StatusBar = gloss({
  margin: 5,
  borderRadius: 7,
  padding: [0, 4],
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
  // boxShadow: [[0, 0, 18, [0, 0, 0, 0.07]]],
  // backdropFilter: 'blur(10px)',
}).theme((_, theme) => ({
  background: theme.background.alpha(0.98),
  border: [1, theme.borderColor.alpha(0.5)],
}))

StatusBar.Space = gloss({
  width: 10,
})

const AppStatusBarTextProps = {
  alignItems: 'center',
  fontWeight: 500,
  alpha: 0.8,
  size: 0.95,
  fontSize: 12,
}

StatusBar.Button = props => <RoundButton {...AppStatusBarTextProps} {...props} />

StatusBar.Text = props => <Text {...AppStatusBarTextProps} {...props} />

StatusBar.Section = props => <Row alignItems="center" {...props} />

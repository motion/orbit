import * as React from 'react'
import { view } from '@mcro/black'
import { RoundButton } from '../../../views'
import { Row, Text } from '@mcro/ui'

export const PeekBar = view({
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
  boxShadow: [[0, 0, 18, [0, 0, 0, 0.07]]],
  // backdropFilter: 'blur(10px)',
}).theme(({ theme }) => ({
  background: theme.background.alpha(0.98),
  border: [1, theme.borderColor],
}))

PeekBar.Space = view({
  width: 10,
})

const peekBarTextProps = {
  alignItems: 'center',
  fontWeight: 500,
  alpha: 0.8,
  size: 0.95,
  fontSize: 12,
}

PeekBar.Button = props => <RoundButton {...peekBarTextProps} {...props} />

PeekBar.Text = props => <Text {...peekBarTextProps} {...props} />

PeekBar.Section = props => <Row alignItems="center" {...props} />

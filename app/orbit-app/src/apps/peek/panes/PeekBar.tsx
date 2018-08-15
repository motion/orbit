import { view } from '@mcro/black'
import { RoundButton } from '../../../views'
import { Row, Text } from '@mcro/ui'

export const PeekBar = view({
  margin: 5,
  borderRadius: 7,
  padding: [2, 4],
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
  // backdropFilter: 'blur(10px)',
})

PeekBar.theme = ({ theme }) => ({
  background: theme.base.background.alpha(0.9),
  border: [1, theme.base.borderColor],
})

PeekBar.Space = view({
  width: 10,
})

const peekBarTextProps = {
  alignItems: 'center',
  fontWeight: 600,
  alpha: 0.8,
}

PeekBar.Button = props => <RoundButton {...peekBarTextProps} {...props} />

PeekBar.Text = props => <Text {...peekBarTextProps} {...props} />

PeekBar.Section = props => <Row alignItems="center" {...props} />

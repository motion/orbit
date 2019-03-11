import { gloss, SimpleText } from '@o/gloss'
import { Text } from './Text'

export const Paragraph = gloss(SimpleText, {
  margin: [0, 0, '1rem'],
  alpha: 0.85,
  lineHeight: '1.5rem',
})

Text.defaultProps = {
  // TODO @umed typefix my type skills suck
  // @ts-ignore
  sizeLineHeight: 1.5,
}

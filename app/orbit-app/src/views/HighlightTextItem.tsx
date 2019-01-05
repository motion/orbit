import { HighlightText } from './HighlightText'
import { gloss } from '@mcro/gloss'

export const HighlightTextItem = gloss(HighlightText)

HighlightTextItem.defaultProps = {
  alpha: 0.95,
}

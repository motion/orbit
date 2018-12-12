import { view } from '@mcro/black'
import { HighlightText } from './HighlightText'

export const HighlightTextItem = view(HighlightText)

HighlightTextItem.defaultProps = {
  alpha: 0.95,
}

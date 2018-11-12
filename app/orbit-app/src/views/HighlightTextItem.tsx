import { view } from '@mcro/black'
import { HighlightText } from './HighlightText'

export const HighlightTextItem = view(HighlightText)

HighlightTextItem.defaultProps = {
  ellipse: true,
  alpha: 0.65,
}

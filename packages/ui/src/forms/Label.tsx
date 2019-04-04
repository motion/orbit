import { gloss } from '@o/gloss'
import { SimpleText } from '../text/SimpleText'

export const Label = gloss(SimpleText, {
  padding: 5,
})

Label.defaultProps = {
  tagName: 'label',
  alpha: 0.65,
  ellipse: true,
}

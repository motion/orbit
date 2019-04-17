import { gloss } from '@o/gloss'
import { SimpleText } from '@o/ui'

export const Text = gloss(SimpleText, {
  fontFamily: 'GT Eesti',
})

Text.defaultProps = {
  tagName: 'p',
  selectable: true,
}

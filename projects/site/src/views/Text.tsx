import { gloss } from '@o/gloss'
import { SimpleText } from '@o/ui'

export const Text = gloss(SimpleText, {
  fontFamily: 'gt eesti pro display trial',
})

Text.defaultProps = {
  tagName: 'p',
  selectable: true,
}

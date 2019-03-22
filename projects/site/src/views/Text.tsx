import { gloss, SimpleText } from '@o/gloss'

export const Text = gloss(SimpleText, {
  fontFamily: 'gt eesti pro display trial',
})

Text.defaultProps = {
  tagName: 'p',
  selectable: true,
}

import { SimpleText } from '@o/ui'
import { gloss } from 'gloss'

export const Text = gloss(SimpleText, {
  fontFamily: 'GTEesti',
}).withConfig({
  defaultProps: {
    tagName: 'p',
    selectable: true,
  },
})

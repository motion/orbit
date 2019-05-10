import { SimpleText } from '@o/ui'
import { gloss } from 'gloss'

export const Text = gloss(SimpleText, {
  fontFamily: 'GT Eesti',
}).withConfig({
  defaultProps: {
    tagName: 'p',
    selectable: true,
  },
})

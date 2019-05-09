import { gloss } from 'gloss'
import { SimpleText } from '@o/ui'

export const Text = gloss(SimpleText, {
  fontFamily: 'GT Eesti',
}).withConfig({
  defaultProps: {
    tagName: 'p',
    selectable: true,
  },
})

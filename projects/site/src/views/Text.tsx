//!
import { SimpleText } from '@o/ui'
import { gloss } from 'gloss'

import { fontProps } from '../constants'

export const Text = gloss(SimpleText, {
  ...fontProps.BodyFont,
}).withConfig({
  defaultProps: {
    tagName: 'p',
    selectable: true,
  },
})

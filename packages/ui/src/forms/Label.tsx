import { gloss } from 'gloss'
import { HTMLProps } from 'react'

import { SimpleText, SimpleTextProps } from '../text/SimpleText'

export const Label = gloss<SimpleTextProps & HTMLProps<HTMLLabelElement>>(SimpleText, {
  padding: 5,
})

Label.defaultProps = {
  tagName: 'label',
  alpha: 0.65,
  size: 0.85,
  ellipse: true,
}

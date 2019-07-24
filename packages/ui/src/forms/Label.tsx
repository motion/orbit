import { gloss } from 'gloss'
import { HTMLProps } from 'react'

import { SimpleText, SimpleTextProps } from '../text/SimpleText'

export const Label = gloss<SimpleTextProps & HTMLProps<HTMLLabelElement>>(SimpleText)

Label.defaultProps = {
  tagName: 'label',
  alpha: 0.65,
  ellipse: true,
  height: 'max-content',
}

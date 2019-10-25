import { gloss } from 'gloss'
import { HTMLProps } from 'react'

import { SimpleText, SimpleTextProps } from '../text/SimpleText'

export type LabelProps = SimpleTextProps & HTMLProps<HTMLLabelElement>

export const Label = gloss<LabelProps>(SimpleText, {
  tagName: 'label',
  alpha: 0.65,
  ellipse: true,
  height: 'max-content',
})

import { gloss } from '@o/gloss'
import { Paragraph, TextProps } from '@o/ui'
import React from 'react'

export const ParagraphIntro = gloss<TextProps>(props => (
  <Paragraph
    {...{
      size: 1.5,
      sizeLineHeight: 1.3,
    }}
    {...props}
  />
))

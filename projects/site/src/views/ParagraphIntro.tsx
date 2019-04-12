import { gloss } from '@o/gloss'
import { Paragraph, TextProps } from '@o/ui'

export const ParagraphIntro = gloss<TextProps>(Paragraph)

ParagraphIntro.defaultProps = {
  size: 1.2,
  sizeLineHeight: 1.2,
}

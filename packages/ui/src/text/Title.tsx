import { gloss } from 'gloss'

import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export const Title = gloss<TextProps>(Text as any, {
  className: 'ui-title',
  fontWeight: 700,
  sizeFont: 2,
})

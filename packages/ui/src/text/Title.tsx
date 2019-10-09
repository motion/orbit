import { gloss } from 'gloss'

import { Config } from '../helpers/configureUI'
import { Text, TextProps } from './Text'

export type TitleProps = TextProps

export const Title = gloss<TextProps>(Text as any, {
  className: 'ui-title',
  fontWeight: 700,
  ...Config.defaultProps.title,
  sizeFont: 2,
  sizeLineHeight: 1.25,
})

import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type InlineProps = BaseProps

export const Inline = gloss(Base, {
  tagName: 'span',
  display: 'inline',
})

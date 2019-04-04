import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type InlineBlockProps = BaseProps

export const InlineBlock = gloss(Base, {
  display: 'inline-block',
})

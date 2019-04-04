import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type InlineFlexProps = BaseProps

export const InlineFlex = gloss(Base, {
  display: 'inline-flex',
})

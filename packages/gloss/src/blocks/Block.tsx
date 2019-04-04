import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type BlockProps = BaseProps

export const Block = gloss(Base, {
  display: 'block',
})

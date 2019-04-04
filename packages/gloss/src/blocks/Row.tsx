import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type RowProps = BaseProps

export const Row = gloss(Base, {
  display: 'flex',
  flexFlow: 'row',
})

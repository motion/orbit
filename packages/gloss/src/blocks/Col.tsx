import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type ColProps = BaseProps

export const Col = gloss(Base, {
  display: 'flex',
  flexFlow: 'column',
})

import { gloss } from '../gloss'
import { Base, BaseProps } from './Base'

export type FlexProps = BaseProps

export const Flex = gloss(Base, {
  display: 'flex',
  flexDirection: 'column',
})

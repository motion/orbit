import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type AbsoluteProps = FlexProps

export const Absolute = gloss(Flex, {
  position: 'absolute',
})

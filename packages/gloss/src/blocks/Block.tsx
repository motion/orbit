import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type BlockProps = FlexProps

export const Block = gloss(Flex, {
  display: 'block',
})

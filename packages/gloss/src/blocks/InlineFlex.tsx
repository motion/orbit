import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type InlineFlexProps = FlexProps

export const InlineFlex = gloss(Flex, {
  display: 'inline-flex',
})

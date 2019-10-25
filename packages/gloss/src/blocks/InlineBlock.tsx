import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type InlineBlockProps = FlexProps

export const InlineBlock = gloss(Flex, {
  display: 'inline-block',
})

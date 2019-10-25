import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type InlineProps = FlexProps

export const Inline = gloss(Flex, {
  tagName: 'span',
  display: 'inline',
})

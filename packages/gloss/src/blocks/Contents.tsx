import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type ContentsProps = FlexProps

export const Contents = gloss(Flex, {
  display: 'contents',
})

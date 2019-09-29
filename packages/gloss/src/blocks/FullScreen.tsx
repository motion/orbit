import { gloss } from '../gloss'
import { Flex, FlexProps } from './Flex'

export type FullScreenProps = FlexProps

export const FullScreen = gloss(Flex, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

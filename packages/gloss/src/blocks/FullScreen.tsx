import { gloss } from '../gloss'
import { Col, ColProps } from './Col'

export type FullScreenProps = ColProps

export const FullScreen = gloss(Col, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

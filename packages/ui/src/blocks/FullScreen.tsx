import { view } from '@mcro/black'
import { Col } from './Col'

export const FullScreen = view(Col, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

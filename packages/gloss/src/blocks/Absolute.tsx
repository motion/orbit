import { gloss } from '../gloss'
import { Col, ColProps } from './Col'

export type AbsoluteProps = ColProps

export const Absolute = gloss(Col, {
  position: 'absolute',
})

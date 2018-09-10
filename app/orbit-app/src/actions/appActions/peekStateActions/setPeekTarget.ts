import { getTargetPosition } from '../../../helpers/getTargetPosition'
import { peekPosition } from '../../../helpers/peekPosition'
import { PeekTarget } from './types'
import { setAppState } from '../setAppState'

export function setPeekTarget(fromTarget: PeekTarget) {
  const target = getTargetPosition(fromTarget)
  setAppState({
    target,
    ...peekPosition(target),
  })
}

import { getTargetPosition } from '../../../helpers/getTargetPosition'
import { peekPosition } from '../../../helpers/peekPosition'
import { setAppState } from '../setAppState'
import { PeekTarget } from './types'

export function setPeekTarget(fromTarget: PeekTarget) {
  const target = getTargetPosition(fromTarget)
  setAppState({
    target,
    ...peekPosition(target, null, null),
  })
}

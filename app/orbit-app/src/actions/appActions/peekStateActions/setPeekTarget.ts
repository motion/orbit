import { App } from '@mcro/stores'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import { peekPosition } from '../../../helpers/peekPosition'
import { PeekTarget } from './types'

export function setPeekTarget(fromTarget: PeekTarget) {
  const target = getTargetPosition(fromTarget)
  App.setPeekState({
    target,
    ...peekPosition(target),
  })
}

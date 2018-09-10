import { setAppState } from '../setAppState'

export function finishPeekDrag(position) {
  setAppState({
    position,
  })
}

import { App } from '@mcro/stores'

export function finishPeekDrag(position) {
  App.setPeekState({
    position,
  })
}

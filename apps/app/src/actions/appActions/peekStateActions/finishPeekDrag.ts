import { App } from '@mcro/stores'

export function finishPeekDrag(position) {
  App.setPeekState({
    pinned: true,
    position,
  })
}

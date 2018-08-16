import { App } from '@mcro/stores'

export function setHighlightIndex(index: number) {
  App.setPeekState({ highlightIndex: index })
}

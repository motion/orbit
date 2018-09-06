import { App } from '@mcro/stores'

export function setPeekDimensions(dimensions: number[]) {
  App.setPeekState({
    dimensions,
  })
}

import { Bit } from '@mcro/models'
import { App } from '@mcro/all'

export function open(bit: Bit) {
  App.open(bit.url)
}

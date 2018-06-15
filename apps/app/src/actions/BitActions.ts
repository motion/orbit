import { Bit } from '@mcro/models'
import { App } from '@mcro/stores'

export function open(bit: Bit) {
  App.open(bit.url)
}

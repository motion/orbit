import { Bit } from '../../../../models/_'
import { App } from '../../../../stores'

export function open(bit: Bit) {
  App.open(bit.url)
}

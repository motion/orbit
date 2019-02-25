import { command } from '@mcro/bridge'
import { Bit, OpenCommand, PersonBit } from '@mcro/models'

export async function open(item: Bit | PersonBit | string) {
  let url = ''

  if (typeof item === 'string') {
    url = item
  } else {
    if (item.target === 'person-bit') {
      console.warn('no open event for people yet')
      return
    }
    if (item.target === 'bit') {
      url = item.desktopLink || item.webLink
    }
  }

  await command(OpenCommand, { url })
}

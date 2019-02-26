import { command } from '@mcro/bridge'
import { Bit, OpenCommand } from '@mcro/models'

export async function open(item: Bit | string) {
  let url = ''

  if (typeof item === 'string') {
    url = item
  } else {
    if (item.target === 'bit') {
      url = item.desktopLink || item.webLink
    }
  }

  await command(OpenCommand, { url })
}

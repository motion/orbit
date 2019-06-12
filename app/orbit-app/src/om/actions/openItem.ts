import { command } from '@o/bridge'
import { Bit, OpenCommand } from '@o/models'
import { Action } from 'overmind'

export const openItem: Action<Bit | string> = async (_, item) => {
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

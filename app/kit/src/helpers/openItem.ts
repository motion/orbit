import { command } from '@o/bridge'
import { Bit, OpenCommand } from '@o/models'

export const openItem = (item: Bit | string) => {
  let url = ''
  if (typeof item === 'string') {
    url = item
  } else if (item.target === 'bit') {
    url = item.desktopLink || item.webLink || ''
  }
  if (url) {
    command(OpenCommand, { url })
  } else {
    console.warn('no url', item)
  }
}

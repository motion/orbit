import { App, Desktop, Electron } from '@mcro/stores'
import { Bit, PersonBit } from '@mcro/models'

export async function open(url) {
  App.sendMessage(Desktop, Desktop.messages.OPEN, url)
}

export async function openItem(item?: Bit | PersonBit) {
  if (!item) {
    return
  }
  if (item.target === 'person-bit') {
    // App.actions.open('')
    return
  }
  if (item.target === 'bit') {
    App.actions.open(item.desktopLink || item.webLink)
    return
  }
}

export async function copyLink(item?: Bit | PersonBit) {
  if (!item) {
    return
  }
  let link
  if (item.target === 'bit') {
    link = item.webLink
  }
  App.sendMessage(Electron, Electron.messages.COPY, link)
}

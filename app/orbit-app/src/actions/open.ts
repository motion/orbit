import { command } from '@mcro/model-bridge'
import { Bit, OpenCommand, PersonBit } from '@mcro/models'
import { App, Electron } from '@mcro/stores'
import { AppActions } from './AppActions'

export async function open(url) {
  await command(OpenCommand, { url })
}

export async function openItem(item?: Bit | PersonBit) {
  if (!item) {
    return
  }
  if (item.target === 'person-bit') {
    // Actions.open('')
    return
  }
  if (item.target === 'bit') {
    AppActions.open(item.desktopLink || item.webLink)
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

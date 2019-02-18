import { Bit, OpenCommand, PersonBit } from '@mcro/models'
import { App, Electron } from '@mcro/stores'
import { command } from '../../mediator'

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

export async function copyLink(item?: Bit | PersonBit) {
  if (!item) return
  let link
  if (item.target === 'bit') {
    link = item.webLink
  }
  App.sendMessage(Electron, Electron.messages.COPY, link)
}

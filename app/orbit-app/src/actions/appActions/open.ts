import { App, Desktop } from '@mcro/stores'

export async function open(url) {
  App.sendMessage(Desktop, Desktop.messages.OPEN, url)
  App.setOrbitState({ hidden: true, docked: false })
}

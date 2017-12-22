import { store } from '@mcro/black'

const ws = new WebSocket('ws://localhost:40510')

@store
export default class ContextStore {
  context = null

  willMount() {
    ws.onmessage = data => {
      console.log('got message', data)
      this.context = data
    }
  }
}

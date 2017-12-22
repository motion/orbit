import { store } from '@mcro/black'
import ReconnectingWebSocket from 'reconnecting-websocket'

const ws = new ReconnectingWebSocket('ws://localhost:40510')

@store
export default class ContextStore {
  context = null
  ocr = null
  lastScreenChange = null

  pause() {
    ws.send(JSON.stringify({ action: 'stop' }))
  }

  resume() {
    ws.send(JSON.stringify({ action: 'start' }))
  }

  willMount() {
    ws.onmessage = ({ data }) => {
      if (data) {
        const { context, ocr, lastScreenChange } = JSON.parse(data)
        this.context = context
        this.ocr = ocr
        this.lastScreenChange = lastScreenChange
      }
    }
  }
}

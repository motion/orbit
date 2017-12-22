import { store } from '@mcro/black'
import ReconnectingWebSocket from 'reconnecting-websocket'

const ws = new ReconnectingWebSocket('ws://localhost:40510')

let cached = null
if (module && module.hot && module.hot.accept) {
  module.hot.accept(() => {
    cached = module.hot.data.cached || null
  })
  module.hot.dispose(data => {
    data.cached = cached
    console.log('caching', data)
  })
}

@store
export default class ContextStore {
  context = null
  ocr = null
  lastScreenChange = null
  lastOCR = null

  pause() {
    ws.send(JSON.stringify({ action: 'stop' }))
  }

  resume() {
    ws.send(JSON.stringify({ action: 'start' }))
  }

  willMount() {
    // restore from hmr
    if (cached) {
      console.log('restoring from cache', cached)
      this.setState(cached)
    }

    ws.onmessage = ({ data }) => {
      if (data) {
        const res = JSON.parse(data)
        this.setState(res)
        this.cached = res
      }
    }
  }

  setState = ({ context, ocr, lastScreenChange, lastOCR }) => {
    this.context = context
    this.ocr = ocr
    this.lastScreenChange = lastScreenChange
    this.lastOCR = lastOCR
  }
}

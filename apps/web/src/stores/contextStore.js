import { store } from '@mcro/black'
import ReconnectingWebSocket from 'reconnecting-websocket'

@store
export default class ContextStore {
  context = null
  ocr = null
  lastScreenChange = null
  lastOCR = null
  mousePosition = null
  keyboard = null

  pause() {
    this.start()
    this.ws.send(JSON.stringify({ action: 'stop' }))
  }

  resume() {
    this.start()
    this.ws.send(JSON.stringify({ action: 'start' }))
  }

  start() {
    if (this.ws) {
      return
    }
    this.ws = new ReconnectingWebSocket('ws://localhost:40510')
    this.ws.onmessage = ({ data }) => {
      if (data) {
        const res = JSON.parse(data)
        // console.log('got data for contextStore', data)
        this.setState(res)
      }
    }
    this.ws.open = function() {
      console.log('websocket open')
    }
    this.ws.onclose = function() {
      console.log('websocket closed')
    }
    this.ws.onerror = function(err) {
      console.log('error', err)
    }
  }

  setState = ({
    keyboard,
    mousePosition,
    context,
    ocr,
    lastScreenChange,
    lastOCR,
  }) => {
    if (keyboard) {
      this.keyboard = keyboard
    }
    if (mousePosition) {
      this.mousePosition = mousePosition
    }
    if (context) {
      this.context = context
    }
    if (ocr) {
      console.log('got new ocr', ocr.map(x => x.word).join(','))
      this.ocr = ocr
    }
    if (lastScreenChange) {
      this.lastScreenChange = lastScreenChange
    }
    if (lastOCR) {
      this.lastOCR = lastOCR
    }
  }
}

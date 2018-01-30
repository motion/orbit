import { store } from '@mcro/black'
import ReconnectingWebSocket from 'reconnecting-websocket'

@store
export default class ContextStore {
  context = null
  ocrWords = null
  linePositions = null
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
    this.ws.onopen = function() {
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
    ocrWords,
    lastScreenChange,
    lastOCR,
    linePositions,
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
    if (ocrWords) {
      console.log('got new ocr', ocrWords)
      this.ocrWords = ocrWords
    }
    if (lastScreenChange) {
      this.lastScreenChange = lastScreenChange
    }
    if (lastOCR) {
      this.lastOCR = lastOCR
    }
    if (linePositions) {
      this.linePositions = linePositions
    }
  }
}

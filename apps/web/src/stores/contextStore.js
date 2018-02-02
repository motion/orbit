import { store } from '@mcro/black'
import ReconnectingWebSocket from 'reconnecting-websocket'

@store
export default class ContextStore {
  appState = null
  ocrWords = null
  linePositions = null
  lastScreenChange = null
  lastOCR = null
  mousePosition = null
  keyboard = null
  highlightWords = null || {}
  clearWords = {}

  pause() {
    this.start()
    this.ws.send(JSON.stringify({ action: 'stop' }))
  }

  resume() {
    this.start()
    this.ws.send(JSON.stringify({ action: 'start' }))
  }

  start() {
    window.contextStore = this
    if (this.ws) {
      return
    }
    this.ws = new ReconnectingWebSocket('ws://localhost:40510')
    this.ws.onmessage = ({ data }) => {
      if (data) {
        const res = JSON.parse(data)
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
    appState,
    ocrWords,
    lastScreenChange,
    lastOCR,
    linePositions,
    highlightWords,
    clearWord,
    restoreWord,
  }) => {
    if (keyboard) {
      this.keyboard = keyboard
    }
    if (mousePosition) {
      this.mousePosition = mousePosition
    }
    if (appState) {
      this.appState = appState
    }
    if (ocrWords) {
      console.log('got new ocr', ocrWords)
      this.ocrWords = ocrWords
      this.clearWords = {}
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
    if (highlightWords) {
      this.highlightWords = highlightWords
    }
    if (clearWord) {
      this.clearWords = {
        ...this.clearWords,
        [clearWord]: true,
      }
    }
    if (restoreWord) {
      this.clearWords = {
        ...this.clearWords,
        [restoreWord]: false,
      }
    }
  }
}

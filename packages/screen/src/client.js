import WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default class ScreenClient {
  isOpen = false
  isRunning = false
  queuedMessages = []

  constructor() {
    this._setupLink()
  }

  pause = () => {
    this._send({ action: 'pause' })
  }

  resume = () => {
    this._send({ action: 'start' })
  }

  toggle = () => {
    if (this.isRunning) {
      this.pause()
    } else {
      this.resume()
    }
  }

  _setupLink() {
    this.ws = new ReconnectingWebSocket('ws://localhost:40512', undefined, {
      constructor: WebSocket,
    })
    this.ws.onmessage = ({ data }) => {
      console.log('screen got data', data)
      if (data && data.state) {
        for (const key of Object.keys(data.state)) {
          this[key] = data.state[key]
        }
      }
    }
    this.ws.open = () => {
      this.isOpen = true
      if (this.queuedMessages.length) {
        for (const message of this.queuedMessages) {
          this.send(message)
        }
        this.queuedMessages = []
      }
    }
    this.ws.onclose = () => {
      this.isOpen = false
    }
    this.ws.onerror = err => {
      console.log('error', err.message)
      this.isOpen = false
    }
  }

  _send(object) {
    if (this.isOpen) {
      this.ws.send(JSON.stringify(object))
    } else {
      this.queuedMessages.push(object)
    }
  }
}

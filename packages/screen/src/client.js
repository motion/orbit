import WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default class ScreenClient {
  isOpen = false
  state = {
    isRunning: false,
    isPaused: false,
  }
  queuedMessages = []

  constructor({ onStateChange } = {}) {
    this.onStateChange = onStateChange || (_ => _)
    this._setupLink()
  }

  clear = () => {
    this._send({ action: 'clear' })
  }

  pause = () => {
    this._send({ action: 'pause' })
  }

  resume = () => {
    this._send({ action: 'resume' })
  }

  toggle = () => {
    if (!this.state.isPaused) {
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
      try {
        if (data.slice(0, 5) === 'state') {
          const newState = JSON.parse(data.slice(6))
          this.state = {
            ...this.state,
            ...newState,
          }
          this.onStateChange(this.state)
        }
      } catch (err) {
        console.log(`client receiving message error`, data)
      }
    }
    this.ws.onopen = () => {
      this.isOpen = true
      if (this.queuedMessages.length) {
        for (const message of this.queuedMessages) {
          this._send(message)
        }
        this.queuedMessages = []
      }
    }
    this.ws.onclose = () => {
      this.isOpen = false
    }
    this.ws.onerror = err => {
      if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
        // ignore
        return
      }
      console.log('client ws error', err.message)
    }
  }

  _send(object) {
    console.log('this.isOpen', this.isOpen, object)
    if (this.isOpen) {
      this.ws.send(JSON.stringify(object))
    } else {
      this.queuedMessages.push(object)
    }
  }
}

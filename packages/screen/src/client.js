import WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'

const splitAt = index => x => [x.slice(0, index), x.slice(index)]

export default class ScreenClient {
  isOpen = false
  state = {
    isRunning: false,
  }
  queuedMessages = []
  onStateChange = _ => _

  constructor({ onStateChange } = {}) {
    this.onStateChange = onStateChange
    this._setupLink()
  }

  pause = () => {
    this._send({ action: 'pause' })
  }

  start = () => {
    this._send({ action: 'start' })
  }

  toggle = () => {
    if (this.state.isRunning) {
      this.pause()
    } else {
      this.start()
    }
  }

  _setupLink() {
    this.ws = new ReconnectingWebSocket('ws://localhost:40512', undefined, {
      constructor: WebSocket,
    })
    this.ws.onmessage = ({ data }) => {
      try {
        const [action, rawValue] = splitAt(data.indexOf(' '))(data)
        let value = rawValue.trim()
        if (value && value.length) {
          value = JSON.parse(value)
        }
        if (action === 'state') {
          console.log('got state', value)
          this.state = value
          if (this.onStateChange) {
            this.onStateChange(this.state)
          }
        }
      } catch (err) {
        console.log(`client receiving message error`, err.message)
      }
    }
    this.ws.onopen = () => {
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
    console.log('this.isOpen', this.isOpen, object)
    if (this.isOpen) {
      this.ws.send(JSON.stringify(object))
    } else {
      this.queuedMessages.push(object)
    }
  }
}

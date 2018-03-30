import { store } from '@mcro/black/store'
import WebSocket from './helpers/websocket'
import * as ReconnectingWebSocket from 'reconnecting-websocket'
import Desktop from './Desktop'
import debug from '@mcro/debug'

const log = debug('Swift')

@store
class Swift {
  ws: ReconnectingWebSocket
  isOpen = false
  state = {
    isRunning: false,
    isPaused: false,
  }
  queuedMessages = []
  onStateChange: Function

  constructor(props = { onStateChange: _ => _ }) {
    this.onStateChange = props.onStateChange
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

  defocus = () => {
    if (Desktop.state.focusedOnOrbit) {
      log('defocusing')
      this._send({ action: 'defocus' })
    }
  }

  toggle = () => {
    console.log('will toggle, isPaused?', this.state.isPaused)
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
      if (err.preventDefault) {
        err.preventDefault()
        err.stopPropagation()
      }
      // err.preventDefault()
      // err.stopPropagation()
      if (this.ws.readyState == 1) {
        console.log('swift ws error', err)
      }
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

export default new Swift()

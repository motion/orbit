import { store } from '@mcro/black'
import { WebSocket, ReconnectingWebSocket } from '@mcro/mobx-bridge'
import { getGlobalConfig } from '@mcro/config'

export let Swift = null as SwiftStore

// @ts-ignore
@store
class SwiftStore {
  ws: any
  isOpen = false
  state = {
    isRunning: false,
    isPaused: false,
  }
  queuedMessages = []
  onStateChange: Function

  constructor(props = { onStateChange: _ => _ }) {
    this.onStateChange = props.onStateChange
    // this.setupLink()
  }

  clear = () => {
    this.send({ action: 'clear' })
  }

  pause = () => {
    this.send({ action: 'pause' })
  }

  resume = () => {
    this.send({ action: 'resume' })
  }

  defocus = () => {
    this.send({ action: 'defocus' })
  }

  toggle = () => {
    console.log('will toggle, isPaused?', this.state.isPaused)
    if (!this.state.isPaused) {
      this.pause()
    } else {
      this.resume()
    }
  }

  private setupLink() {
    this.ws = new ReconnectingWebSocket(
      `ws://localhost:${getGlobalConfig().ports.swift}`,
      undefined,
      {
        constructor: WebSocket,
      },
    )
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
        console.log('client receiving message error', data)
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
      // reconnecting websocket reconnect fix: https://github.com/pladaria/reconnecting-websocket/issues/60
      if (this.ws._shouldReconnect) {
        this.ws._connect()
      }
    }
    this.ws.onerror = err => {
      if (err.preventDefault) {
        err.preventDefault()
        err.stopPropagation()
      }
      if (this.ws.readyState == 1) {
        console.log('swift ws error', err)
      }
    }
  }

  private send(object) {
    if (this.isOpen) {
      this.ws.send(typeof object === 'string' ? object : JSON.stringify(object))
    } else {
      console.log('not open queue', object)
      this.queuedMessages.push(object)
    }
  }
}

Swift = new SwiftStore()

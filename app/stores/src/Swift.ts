import { store, react } from '@mcro/black'
import { WebSocket, ReconnectingWebSocket } from '@mcro/mobx-bridge'
import { Desktop } from './Desktop'
import { getConfig } from '@mcro/config'

export let Swift

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
  }

  setupOnVersion = react(
    () => Desktop.state.operatingSystem.macVersion || '',
    version => {
      if (version.indexOf('10') !== 0) {
        throw react.cancel
      }
      if (+version.split('.')[1] < 12) {
        throw react.cancel
      }
      this.setupLink()
    },
  )

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
      `ws://localhost:${getConfig().ports.swift}`,
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
      this.ws.send(JSON.stringify(object))
    } else {
      console.log('not open queue', object)
      this.queuedMessages.push(object)
    }
  }
}

Swift = new SwiftStore()

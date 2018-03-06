import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from './websocket'
import waitPort from 'wait-port'

export default async function setupSocket() {
  if (typeof window === 'undefined') {
    await waitPort({ host: 'localhost', port: 40510 })
  }
  this.ws = new ReconnectingWebSocket('ws://localhost:40510', undefined, {
    constructor: WebSocket,
  })
  this.ws.onmessage = ({ data }) => {
    if (!data) {
      console.log(`No data received over socket`)
      return
    }
    try {
      const messageObj = JSON.parse(data)
      if (messageObj && typeof messageObj === 'object') {
        const { source, state } = messageObj
        if (this.options.ignoreSource && this.options.ignoreSource[source]) {
          return
        }
        if (!state) {
          throw new Error(`No state received from message: ${data}`)
        }
        this._update(source, state)
      } else {
        throw new Error(`Non-object received`)
      }
    } catch (err) {
      console.log(
        `${err.message}:\n${err.stack}\n
      ScreenStore error receiving or reacting to message. Initial message:
        ${data}`,
      )
    }
  }
  this.ws.onopen = () => {
    this._wsOpen = true
    // send state that hasnt been synced yet
    if (this._queuedState) {
      this.ws.send(JSON.stringify({ state: this.state, source: this._source }))
      this._queuedState = false
    }
  }
  this.ws.onclose = () => {
    this._wsOpen = false
  }
  this.ws.onerror = err => {
    if (this.ws.readyState == 1) {
      console.log('swift ws error', err)
    }
  }
}

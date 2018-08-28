import { ClientTransportInterface } from './ClientTransportInterface'

export class WebSocketClientTransport implements ClientTransportInterface {
  websocket: WebSocket
  operationId: number = 0
  subscriptions: {
    operationId: number
    onSuccess: Function
    onError: Function
  }[] = []

  constructor(websocket: WebSocket) {
    this.websocket = websocket
    this.websocket.onmessage = ({ data }) => this.handleData(JSON.parse(data))
    this.websocket.onerror = err => {
      console.error('ws error', err)
    }
    this.websocket.onclose = () => {
      // reconnecting websocket reconnect fix: https://github.com/pladaria/reconnecting-websocket/issues/60
      // @ts-ignore
      if (this.websocket._shouldReconnect) {
        // @ts-ignore
        this.websocket._connect()
      }
    }
  }

  execute(value: any): Promise<any> {
    this.operationId++
    const query = {
      operationId: this.operationId,
      value,
    }
    return new Promise((ok, fail) => {
      try {
        if (this.websocket.OPEN) {
          this.websocket.send(JSON.stringify(query))
        } else {
          console.warn('socket closed')
        }
      } catch (err) {
        fail(`WAIT! Failed to execute websocket operation ${JSON.stringify(err)}`)
        return
      }
      const subscription: any = { operationId: this.operationId }
      subscription.onSuccess = result => {
        this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1)
        ok(result)
      }
      subscription.onError = result => {
        this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1)
        fail(result)
      }
      this.subscriptions.push(subscription)
    })
  }

  private handleData(data: any) {
    if (data.operationId) {
      const subscription = this.subscriptions.find(
        subscription => subscription.operationId === data.operationId,
      )
      if (subscription) {
        subscription.onSuccess(data.result)
      }
    }
  }

}

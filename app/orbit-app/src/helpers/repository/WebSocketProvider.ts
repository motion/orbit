import { RepositoryOperationType } from './Repository'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { getGlobalConfig } from '@mcro/config'

export class WebSocketProvider {
  websocket: ReconnectingWebSocket
  operationId: number = 0
  subscriptions: {
    operationId: number
    onSuccess: Function
    onError: Function
  }[] = []

  constructor() {
    this.websocket = new ReconnectingWebSocket(
      `ws://localhost:${getGlobalConfig().ports.dbBridge}`,
      [],
      {
        WebSocket,
      },
    )
    this.websocket.onmessage = ({ data }) => this.handleData(JSON.parse(data))
    this.websocket.onerror = err => {
      console.log('ws error', err)
    }
    this.websocket.onclose = () => {
      console.log('Provider closed')
      // reconnecting websocket reconnect fix: https://github.com/pladaria/reconnecting-websocket/issues/60
      // @ts-ignore
      if (this.websocket._shouldReconnect) {
        // @ts-ignore
        this.websocket._connect()
      }
    }
  }

  handleData(data: any) {
    if (data.operationId) {
      const subscription = this.subscriptions.find(
        subscription => subscription.operationId === data.operationId,
      )
      if (subscription) {
        subscription.onSuccess(data.result)
      }
    }
  }

  execute(
    entity: string,
    operation: RepositoryOperationType,
    parameters: any[] = [],
  ): Promise<any> {
    this.operationId++
    const query = {
      operationId: this.operationId,
      entity,
      operation,
      parameters,
    }
    return new Promise((ok, fail) => {
      try {
        if (this.websocket.OPEN) {
          this.websocket.send(JSON.stringify(query))
        } else {
          console.warn('socket closed')
        }
      } catch (err) {
        fail(`Failed to execute websocket operation ${JSON.stringify(query)}`)
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
}

import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common'
import { ClientTransport } from './ClientTransport'
import { log } from '../common/logger'
import Observable from 'zen-observable'

export class WebSocketClientTransport implements ClientTransport {
  websocket: WebSocket
  operationCode: string
  operationId: number = 0
  subscriptions: {
    operationId: number
    onSuccess: Function
    onError: Function
  }[] = []
  private onConnectedCallbacks: (() => void)[] = []

  constructor(websocket: WebSocket) {
    this.operationCode = this.generateRandom()
    this.websocket = websocket
    this.websocket.onopen = () => {
      this.onConnectedCallbacks.forEach(callback => callback())
      this.onConnectedCallbacks = []
    }
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

  observe(type: TransportRequestType, values: TransportRequestValues): Observable<any> {
    const operationId = ++this.operationId // don't change - will lead to wrong id
    const data = {
      id: this.operationCode + '_' + operationId,
      type,
      ...values,
    }

    return new Observable(subject => {
      const subscription = {
        operationId: operationId,
        onSuccess(result) {
          subject.next(result)
        },
        onError(error) {
          subject.error(error)
        },
      }
      this.subscriptions.push(subscription)

      const callback = () => {
        try {
          this.websocket.send(JSON.stringify(data))
        } catch (err) {
          subject.error(err)
          console.warn(`Failed to execute websocket operation ${JSON.stringify(err)}`)
        }
      }

      if (this.websocket.readyState === this.websocket.OPEN) {
        callback()
      } else {
        this.onConnectedCallbacks.push(callback)
      }

      // remove subscription on cancellation
      return () => {
        const index = this.subscriptions.indexOf(subscription)
        if (index !== -1) this.subscriptions.splice(index, 1)

        this.websocket.send(
          JSON.stringify({
            id: this.operationCode + '_' + operationId,
            type: 'unsubscribe',
          }),
        )
      }
    })
  }

  execute(type: TransportRequestType, values: TransportRequestValues): Promise<any> {
    const operationId = ++this.operationId // don't change - will lead to wrong id
    const query = {
      id: this.operationCode + '_' + operationId,
      type,
      ...values,
    }
    return new Promise((ok, fail) => {
      const callback = () => {
        try {
          log.verbose(`sent client data`, query)
          this.websocket.send(JSON.stringify(query))
        } catch (err) {
          fail(`Failed to execute websocket operation ${JSON.stringify(err)}`)
          return
        }

        const subscriptions = this.subscriptions
        this.subscriptions.push({
          operationId: operationId,
          onSuccess(result) {
            subscriptions.splice(subscriptions.indexOf(this), 1)
            ok(result)
          },
          onError(error) {
            subscriptions.splice(subscriptions.indexOf(this), 1)
            fail(error)
          },
        })
      }
      if (this.websocket.readyState === this.websocket.OPEN) {
        callback()
      } else {
        this.onConnectedCallbacks.push(callback)
      }
    })
  }

  private generateRandom() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = ''
    for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
  }

  private handleData(data: TransportResponse) {
    if (data.id) {
      const [operationCode, operationId] = data.id.split('_')
      if (this.operationCode !== operationCode) return

      log.verbose(`handling client data`, data)
      const subscription = this.subscriptions.find(subscription => {
        return subscription.operationId === parseInt(operationId)
      })
      if (subscription) {
        subscription.onSuccess(data.result)
      }
    }
  }
}

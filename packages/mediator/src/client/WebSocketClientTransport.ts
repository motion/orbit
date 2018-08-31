import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common'
import { ClientTransport } from './ClientTransport'
import Observable = require('zen-observable')

export class WebSocketClientTransport implements ClientTransport {
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

  observe(type: TransportRequestType, values: TransportRequestValues): Observable<any> {
    const operationId = ++this.operationId // don't change - will lead to wrong id
    const data = {
      id: operationId,
      type,
      ...values
    }

    return new Observable(subject => {
      if (!this.websocket.OPEN) {
        console.warn('socket closed')
        return
      }
      try {
        this.websocket.send(JSON.stringify(data))
      } catch (err) {
        subject.error(err);
        console.warn(`Failed to execute websocket operation ${JSON.stringify(err)}`)
        return
      }

      const subscription = {
        operationId: operationId,
        onSuccess(result) {
          subject.next(result)
        },
        onError(error) {
          subject.error(error)
        }
      }
      this.subscriptions.push(subscription)

      // remove subscription on cancellation
      return () => {
        const index = this.subscriptions.indexOf(subscription)
        if (index !== -1)
          this.subscriptions.splice(index, 1)

        this.websocket.send(JSON.stringify({
          id: operationId,
          type: "unsubscribe"
        }))
      };
    });
  }

  execute(type: TransportRequestType, values: TransportRequestValues): Promise<any> {
    const operationId = ++this.operationId // don't change - will lead to wrong id
    const query = {
      id: operationId,
      type,
      ...values,
    }
    return new Promise((ok, fail) => {
      if (!this.websocket.OPEN) {
        console.warn('socket closed')
        return
      }

      try {
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
        }
      })
    })
  }

  private handleData(data: TransportResponse) {
    if (data.id) {
      const subscription = this.subscriptions.find(subscription => {
        return subscription.operationId === data.id
      })
      if (subscription) {
        subscription.onSuccess(data.result)
      }
    }
  }

}

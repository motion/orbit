import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common'
import { ClientTransport } from './ClientTransport'
import { log } from '../common/logger'
import Observable from 'zen-observable'

export class WebSocketClientTransport implements ClientTransport {
  websocket: WebSocket
  name: string
  operationsCounter: number = 0
  subscriptions: {
    id: number
    type: string
    name: string
    onSuccess: Function
    onError: Function
  }[] = []
  private onConnectedCallbacks: (() => void)[] = []

  constructor(name: string, websocket: any) {
    this.name = name
    this.websocket = websocket

    websocket.onopen = () => {
      this.onConnectedCallbacks.forEach(callback => callback())
      this.onConnectedCallbacks = []
    }
    websocket.onmessage = ({ data }) => this.handleData(JSON.parse(data))
    websocket.onerror = err => {
      console.log('err', typeof err, err && typeof err.error)
      if (err && err.error) {
        if (`${err.error}`.indexOf('ECONNREFUSED')) {
          log.info(`Connection refused ${name}...`)
        } else {
          log.error(`Error ${name} ${err.error}`)
        }
      } else {
        log.error(err)
      }
    }
    websocket.onclose = () => {
      if (websocket._shouldReconnect) {
        websocket._connect()
      }
    }

    // pong functionality
    // setInterval(() => {
    //   if (this.websocket.readyState === this.websocket.OPEN) {
    //     this.websocket.send("PONG")
    //   }
    // }, 1000);
  }

  /**
   * Creates a new observable that listens to the server events for the requested operation.
   */
  observe(type: TransportRequestType, values: TransportRequestValues): Observable<any> {
    const id = ++this.operationsCounter // don't change - can lead to wrong id
    const data = {
      id: this.name + '_' + id,
      type,
      ...values,
    }

    return new Observable(subject => {
      // create a new subscription
      const subscription = {
        id,
        type,
        name: values.model,
        onSuccess(result) {
          subject.next(result)
        },
        onError(error) {
          subject.error(error)
        },
      }
      this.subscriptions.push(subscription)
      log.verbose('created a new subscription', {
        id: data.id,
        type: subscription.type,
        name: subscription.name,
      })

      // we need to send request to the server - here we create a function that does it
      // and if we already have a connection with websockets we execute this function and send a request
      // but if connection isn't established yet, we push function to the list that is going
      // to be executed later on when websocket connection will be established
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

      return () => {
        // remove subscription on cancellation
        const index = this.subscriptions.indexOf(subscription)
        if (index !== -1) this.subscriptions.splice(index, 1)

        const data = {
          id: this.name + '_' + id,
          type: 'unsubscribe',
        }
        this.websocket.send(JSON.stringify(data))
        log.verbose('removed subscription', {
          id: data.id,
          type: subscription.type,
          name: subscription.name,
        })
      }
    })
  }

  /**
   * Executes a single-time command and returns results emitted by the server.
   */
  execute(type: TransportRequestType, values: TransportRequestValues): Promise<any> {
    const id = ++this.operationsCounter // don't change - will lead to wrong id
    const query = {
      id: this.name + '_' + id,
      type,
      ...values,
    }
    return new Promise((ok, fail) => {
      // we need to send request to the server - here we create a function that does it
      // and if we already have a connection with websockets we execute this function and send a request
      // but if connection isn't established yet, we push function to the list that is going
      // to be executed later on when websocket connection will be established
      const callback = () => {
        try {
          log.verbose('sent client data', query)
          this.websocket.send(JSON.stringify(query))
        } catch (err) {
          fail(`Failed to execute websocket operation ${JSON.stringify(err)}`)
          return
        }

        const subscriptions = this.subscriptions
        this.subscriptions.push({
          id,
          type,
          name: values.command,
          onSuccess(result) {
            // remove subscription once command is done
            subscriptions.splice(subscriptions.indexOf(this), 1)
            ok(result)
          },
          onError(error) {
            // remove subscription once command is done
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

  /**
   * Handles data returned by a server.
   */
  private handleData(data: TransportResponse) {
    if (!data.id) {
      log.warning(`data id is missing in the request to the client ${this.name}`, data)
      return
    }

    const [operationCode, id] = data.id.split('_')
    if (this.name !== operationCode) {
      log.warning(`unexpected data come to the client ${this.name}`, data)
      return
    }

    const subscription = this.subscriptions.find(subscription => {
      return subscription.id === parseInt(id)
    })
    if (!subscription) {
      log.warning(`no subscription found in the client ${this.name}`, data)
      return
    }

    log.verbose('received data', {
      id: data.id,
      type: subscription.type,
      name: subscription.name,
      result: data.result,
    })
    subscription.onSuccess(data.result)
  }
}

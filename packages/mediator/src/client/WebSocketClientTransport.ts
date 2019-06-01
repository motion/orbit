import { selectDefined } from '@o/utils'
import Observable from 'zen-observable'

import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common'
import { log } from '../common/logger'
import { ClientTransport } from './ClientTransport'

let tm = null

export class WebSocketClientTransport implements ClientTransport {
  websocket: WebSocket
  name: string
  operationsCounter: number = 0
  subscriptions: {
    id: number
    type: string
    name: string
    onSuccess: (response: TransportResponse) => any
    onError: Function
  }[] = []
  private onConnectedCallbacks: (() => void)[] = []

  constructor(name: string, websocket: any) {
    this.name = name
    this.websocket = websocket

    websocket.onopen = () => {
      clearTimeout(tm)
      this.onConnectedCallbacks.forEach(callback => callback())
      this.onConnectedCallbacks = []
    }
    websocket.onmessage = ({ data }) => this.handleData(JSON.parse(data))

    let retryDelay = 1000
    websocket.onerror = ({ error }) => {
      if (`${error}`.indexOf('ECONNREFUSED')) {
        clearTimeout(tm)
        retryDelay = Math.min(100000, retryDelay * 2)
        tm = setTimeout(
          () => log.info(`Connection refused ${name}, retrying after ${retryDelay}...`),
          retryDelay,
        )
      } else {
        log.error(`Error ${name} ${error}`)
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
  observe(
    type: TransportRequestType,
    values: TransportRequestValues,
  ): Observable<TransportResponse> {
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
        values,
      })

      // we need to send request to the server - here we create a function that does it
      // and if we already have a connection with websockets we execute this function and send a request
      // but if connection isn't established yet, we push function to the list that is going
      // to be executed later on when websocket connection will be established
      const callback = () => {
        try {
          this.websocket.send(JSON.stringify(selectDefined(data, null)))
        } catch (err) {
          subject.error(err)
          console.warn(`Failed to execute websocket operation ${err} ${err.message} ${err.stack}`)
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

        const response = {
          id: this.name + '_' + id,
          type: 'unsubscribe',
        }
        this.websocket.send(JSON.stringify(response))
        log.verbose('removed subscription', {
          id: response.id,
          type: subscription.type,
          name: subscription.name,
        })
      }
    })
  }

  /**
   * Executes a single-time command and returns results emitted by the server.
   */
  execute(type: TransportRequestType, values: TransportRequestValues): Promise<TransportResponse> {
    const id = ++this.operationsCounter // don't change - will lead to wrong id
    const query = {
      ...values,
      id: this.name + '_' + id,
      type,
    }
    return new Promise((resolve, fail) => {
      // we need to send request to the server - here we create a function that does it
      // and if we already have a connection with websockets we execute this function and send a request
      // but if connection isn't established yet, we push function to the list that is going
      // to be executed later on when websocket connection will be established
      const callback = () => {
        try {
          log.verbose(`sent client data ${query.model} ${query.type} ${query.id}`, query.args)
          this.websocket.send(JSON.stringify(query))
        } catch (err) {
          fail(`Failed to execute websocket operation ${err.message} ${err.stack} ${err}`)
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
            resolve(result)
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

    const subscription = this.subscriptions.find(x => x.id === +id)

    if (!subscription) {
      log.verbose(
        `observe has been disposed, no subscription found in the client ${this.name}`,
        data,
      )
      return
    }

    if (process.env.NODE_ENV === 'development') {
      log.verbose('received data', {
        id: data.id,
        type: subscription.type,
        name: subscription.name,
        result: data.result,
        notFound: data.notFound,
        sendIdentifier: data.sendIdentifier,
      })
    }

    subscription.onSuccess(data)
  }
}

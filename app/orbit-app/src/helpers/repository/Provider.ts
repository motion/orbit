import { RepositoryOperationType } from './Repository'

export class Provider {
  primus: any
  operationId: number = 0
  subscriptions: {
    operationId: number
    onSuccess: Function
    onError: Function
  }[] = []

  constructor() {
    this.primus = new window.Primus('http://localhost:8082', {
      websockets: true,
    })
    this.primus.on('data', data => this.handleData(data))
    this.primus.on('error', err => {
      console.log('got an error', err.message, err.stack)
      this.primus.end()
    })
    this.primus.on('close', () => {
      console.log(`primus closed`)
    })
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
    const writeResult: boolean = this.primus.write(query)
    if (!writeResult)
      return Promise.reject(
        `Failed to execute websocket operation ${JSON.stringify(query)}`,
      )

    return new Promise((ok, fail) => {
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

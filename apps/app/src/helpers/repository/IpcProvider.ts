import { RepositoryOperationType } from './Repository'
import * as electron from 'electron'

export class IpcProvider {

  operationId: number = 0
  subscriptions: {
    operationId: number,
    onSuccess: Function,
    onError: Function
  }[] = []

  constructor() {
    electron.ipcRenderer.on('data', data => this.handleData(data))
  }

  handleData(data: any) {
    console.log(`received data`, data)
    if (data.operationId) {
      const subscription = this.subscriptions.find(subscription => subscription.operationId === data.operationId)
      console.log(`found subscription`, subscription)
      if (subscription) {
        subscription.onSuccess(data.result)
      }
    }
  }

  execute(entity: string, operation: RepositoryOperationType, parameters: any[] = []): Promise<any> {
    this.operationId++;
    const query = {
      operationId: this.operationId,
      entity,
      operation,
      parameters,
    }
    console.log(`write a query`, query)
    const writeResult: boolean = electron.ipcRenderer.send('data', query)
    if (!writeResult)
      return Promise.reject(`Failed to execute websocket operation ${JSON.stringify(query)}`)

    return new Promise((ok, fail) => {
      const subscription: any = { operationId: this.operationId };
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
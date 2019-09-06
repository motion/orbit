import { MediatorClient } from '@o/mediator'

let mediatorClient: MediatorClient

export function getMediatorClient() {
  return mediatorClient
}

export function setMediatorClient(next: MediatorClient) {
  mediatorClient = next
}

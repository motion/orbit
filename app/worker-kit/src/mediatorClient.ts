import { MediatorClient } from '@o/mediator'

export let mediatorClient: MediatorClient

export function setMediatorClient(next: MediatorClient) {
  mediatorClient = next
}

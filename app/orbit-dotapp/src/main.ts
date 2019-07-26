import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
import { orTimeout, randomString } from '@o/utils'
import bonjour from 'bonjour'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

async function findBonjourService(type: string, timeout: number) {
  let bonjourInstance = bonjour()
  let waitForService = new Promise(resolve => {
    bonjourInstance.findOne({ type: type }, service => {
      resolve(service.port)
    })
  })
  let service
  try {
    service = await orTimeout(waitForService, timeout)
  } finally {
    bonjourInstance.destroy()
  }
  return service
}

async function getOrbitDesktop() {
  let port = await findBonjourService('orbitDesktop', 5000)
  if (port == null) {
    // TODO(andreypopp): start orbit instead
    throw new Error('orbit-desktop is not running')
  }

  console.log(`orbit-desktop found at ${port} connecting...`)
  let Mediator = new MediatorClient({
    transports: [
      new WebSocketClientTransport(
        'cli-client-' + randomString(5),
        new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
          WebSocket,
          minReconnectionDelay: 1,
        }),
      ),
    ],
  })

  return Mediator
}

async function main() {
  console.log('Connecting to main orbit...')
  try {
    await getOrbitDesktop()
  } catch (err) {
    console.log('error connecting', err)
    console.log('lets try launching orbit first...')
  }
}

main()

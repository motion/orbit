// import { MediatorClient, WebSocketClientTransport } from '@o/mediator'
// import { getGlobalConfig } from '@o/config'
// import ReconnectingWebSocket from 'reconnecting-websocket'
//
// export const Mediator = new MediatorClient({
//   transports: [
//     new WebSocketClientTransport(
//       'syncers', // randomString(5)
//       new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.desktopMediator}`, [], {
//         WebSocket,
//         minReconnectionDelay: 1,
//       }),
//     )
//   ]
// })
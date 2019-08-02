let WebSocket
if (typeof window !== 'undefined') {
  // @ts-ignore
  WebSocket = window.WebSocket
} else {
  // prevent it from being imported by webpack
  WebSocket = eval(`require('ws')`)
}
export default WebSocket

let WebSocket
if (typeof window !== 'undefined') {
  WebSocket = window.WebSocket
} else {
  WebSocket = eval(`require('html5-websocket')`)
}
export default WebSocket

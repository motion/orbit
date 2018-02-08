let WebSocket

if (typeof window !== 'undefined') {
  WebSocket = window.WebSocket
} else {
  // avoid parcel
  WebSocket = eval(`require('ws')`)
}

export default WebSocket

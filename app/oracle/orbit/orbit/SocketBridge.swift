import Foundation
import SwiftWebSocket

class SocketBridge {
  var send: ((String)->Void) = { _ in print("not opened") }
  var onMessage: (String)->Void
  
  init(queue: AsyncGroup, onMessage: @escaping (String)->Void) {
    self.onMessage = onMessage

    // socket bridge
    guard let port = ProcessInfo.processInfo.environment["SOCKET_PORT"] else {
      print("no SOCKET_PORT environment variable set")
      return
    }

    let ws = WebSocket("ws://localhost:\(port)/")

    self.send = { (msg) in
      ws.send(msg)
    }
    ws.event.error = { error in
      print("screen.ws.error \(port) \(error)")
    }
    queue.background {
      ws.event.message = { (message) in
        if let text = message as? String {
          self.onMessage(text)
        }
      }
    }
  }
}

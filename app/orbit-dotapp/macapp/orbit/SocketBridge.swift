import Foundation
import SwiftWebSocket

class SocketBridge {
  var send: ((String)->Void) = { _ in }
  var onMessage: (String)->Void
  
  init(onMessage: @escaping (String)->Void) {
    self.onMessage = onMessage

    // socket bridge
    guard let port = ProcessInfo.processInfo.environment["SOCKET_PORT"] else {
      print("no SOCKET_PORT environment variable set")
      return
    }

    print("connecting to socket on \(port)")
    let ws = WebSocket("ws://localhost:\(port)/")

    self.send = { (msg) in
      ws.send(msg)
    }
    ws.event.error = { error in
      print("screen.ws.error \(port) \(error)")
    }
    ws.event.message = { (message) in
      if let text = message as? String {
        self.onMessage(text)
      }
    }
  }
}

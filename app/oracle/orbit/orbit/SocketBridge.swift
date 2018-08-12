//
//  SocketBridge.swift
//  orbit
//
//  Created by Nathan Wienert on 2/9/18.
//  Copyright © 2018 Nate Wienert. All rights reserved.
//

import Foundation
import SwiftWebSocket
import Async

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

    let ws = WebSocket("ws://localhost:\(port)")

    self.send = { (msg) in
      ws.send(msg)
    }
    ws.event.open = {
//      print("screen.ws.opened")
    }
    ws.event.close = { code, reason, clean in
//      print("screen.ws.close")
    }
    ws.event.error = { error in
      print("screen.ws.error \(error)")
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

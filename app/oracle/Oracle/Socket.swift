//
//  Websocket.swift
//  Oracle
//
//  Created by Collin Hundley on 11/20/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import Swifter


//
// IMPORTANT NOTES:
//
// 1) This class uses only static properties/methods.
//    The reason is purely cosmetic: `Socket.send(...)` instead of `Socket.shared.send(...)`
//
// 2) The Websocket library we're using (Swifter) is pretty crappy.
//    Since there's no apparent way to send server -> client data on demand,
//    we work around the issue by keeping a reference to `WebSocketSession` the first
//    time any client connects to the socket. This seems to work ok so far.
//


/// Central Websocket communication class.
class Socket {
    
    /// Inbound messages received from clients.
    enum InboundMessage {
        // Recording notifications
        case startRecording
        case stopRecording
        case setBounds(bounds: CGRect)
        case setFPS(fps: Int)
        
        // Window notifications
        case startObservingWindows
        case stopObservingWindows
        
        /// Initialize an inbound message from JSON.
        fileprivate init?(json: [String : Any]) {
            guard let action = json["action"] as? String else { return nil }
            
            switch action {
            case "startRecording":
                self = InboundMessage.startRecording
                
            case "stopRecording":
                self = InboundMessage.stopRecording
                
            case "setBounds":
                guard let value = json["value"] as? [String : Any] else { return nil }
                guard let x = value["x"] as? Int,
                    let y = value["y"] as? Int,
                    let width = value["width"] as? Int,
                    let height = value["height"] as? Int else { return nil }
                let bounds = CGRect(x: x, y: y, width: width, height: height)
                self = InboundMessage.setBounds(bounds: bounds)
                
            case "setFPS":
                guard let value = json["value"] as? [String : Any] else { return nil }
                guard let fps = value["fps"] as? Int else { return nil }
                self = InboundMessage.setFPS(fps: fps)
                
            case "startObservingWindows":
                self = InboundMessage.startObservingWindows
                
            case "stopObservingWindows":
                self = InboundMessage.stopObservingWindows
                
            default: // Unsupported action
                Log.error("Unsupported action received via websocket: \(action)")
                return nil
            }
        }
        
    }
    
    
    /// Outbound messages we can send to clients.
    enum OutboundMessage {
        // Mouse notifications
        case mouseMoved(x: Int, y: Int)
        
        // Tray notifications
        case trayHovered(id: String)
        case trayClicked(id: String)
        case trayBounds(top: Int, left: Int, width: Int, height: Int)
        
        // Window notifications
        /// Frontmost window was changed.
        case windowChanged(title: String, size: CGSize, position: CGPoint)
        /// A window moved positions.
        case windowMoved(size: CGSize, position: CGPoint)
        /// A window was resized.
        case windowResized(size: CGSize, position: CGPoint)
        
        // OCR notifications
        /// Words found on screen.
        case wordsFound(words: [Word])
        
        
        /// Serializes the message to JSON format.
        /// NOTE: It would be preferable to do this using the modern Swift `Codable` protocol.
        /// However, in this case the programming overhead would be too high and the code would become bloated.
        /// A simple dictionary works fine.
        fileprivate func json() throws -> Data {
            var message: [String : Any]
            
            switch self {
            case .mouseMoved(let x, let y):
                message = [
                    "action" : "mouseMoved",
                    "value" : [
                        "position" : [x, y]
                    ]
                ]
                
            case .trayHovered(let id):
                message = [
                    "action" : "trayHovered",
                    "value" : [
                        "id" : id,
                    ]
                ]
                
            case .trayClicked(let id):
                message = [
                    "action" : "trayClicked",
                    "value" : [
                        "id" : id,
                    ]
                ]

            case .trayBounds(let top, let left, let width, let height):
                message = [
                    "action" : "trayBounds",
                    "value" : [
                        "size": [width, height],
                        "position": [left, top]
                    ]
                ]
                
            case .windowChanged(let title, let size, let position):
                message = [
                    "action" : "windowEvent",
                    "value" : [
                        "type" : "FrontmostWindowChangedEvent",
                        "id" : 12345, // TODO
                        "title" : title,
                        "size" : [Int(size.width), Int(size.height)],
                        "position" : [Int(position.x), Int(position.y)]
                    ]
                ]

            case .windowMoved(let size, let position):
                message = [
                    "action" : "windowEvent",
                    "value" : [
                        "type" : "WindowPosChangedEvent",
                        "id" : 12345, // TODO
                        "size" : [Int(size.width), Int(size.height)],
                        "position" : [Int(position.x), Int(position.y)]
                    ]
                ]

            case .windowResized(let size, let position):
                message = [
                    "action" : "windowEvent",
                    "value" : [
                        "type" : "WindowPosChangedEvent",
                        "id" : 12345, // TODO
                        "size" : [Int(size.width), Int(size.height)],
                        "position" : [Int(position.x), Int(position.y)]
                    ]
                ]
                
            case .wordsFound(let words):
                let wordsJSON = words.map { (word) -> [String : Any] in
                    return [
                        "string" : word.string,
                        "bounds" : [
                            "x" : Int(word.bounds.minX),
                            "y" : Int(word.bounds.minY),
                            "width" : Int(word.bounds.width),
                            "height" : Int(word.bounds.height)
                        ]
                    ]
                }
                message = [
                    "action" : "words",
                    "value" : wordsJSON
                ]
            }
            
            // Serialize
            return try JSONSerialization.data(withJSONObject: message)
        }
        
    }

    
    /// Main websocket server.
    fileprivate static let server = HttpServer()
    
    /// Stored websocket session (hack to get around library limitations).
    fileprivate static var wsSession: WebSocketSession?
    
    /// Prevent other instances from being created.
    private init() {}
    
}


// MARK: Public API

extension Socket {
    
    /// Starts the websocket server.
    static func start() throws {
        // Read socket port from environment variable
        var port: UInt16 = 8080
        if let portStr = ProcessInfo.processInfo.environment["SOCKET_PORT"], let portInt = UInt16(portStr) {
            port = portInt
        } else {
            Log.error("WARNING: Environment variable not found for websocket port. Defaulting to 8080.")
        }
        
        // Add websocket endpoint
        Socket.server["/oracle"] = websocket(text: Socket.incomingString, binary: Socket.incomingData, connected: Socket.clientConnected)
        
        // Start server
        try server.start(port)
        
        Log.info("Websocket server started on port \(port).")
    }
    
    
    /// Sends a raw string to any connected websocket client.
    static func send(_ str: String) {
        wsSession?.writeText(str)
    }
    
    
    /// Sends the given messsage to any connected websocket client.
    static func send(_ message: OutboundMessage) {
        Log.debug("Sending websocket message...")
        do {
            // Serialize message to JSON format
            let json = try message.json()
            // Convert to [UInt8] (because this library is stupid...)
            let bytes = Array(json)
            // Broadcast data
            wsSession?.writeBinary(bytes)
        } catch {
            Log.error("Error serializing websocket message to JSON: \(error)")
        }
    }
    
}


// MARK: Incoming

fileprivate extension Socket {
    
    /// Called when a new client connects to the websocket.
    static func clientConnected(session: WebSocketSession) {
        Log.info("Websocket client connected")
        // NOTE: This is where we store the socket session locally
        Socket.wsSession = session
    }
    
    
    /// Called when an incoming message is received from a client.
    static func incomingString(session: WebSocketSession, str: String) {
        // Convert string back to raw data
        // (We only care about the data, but some Websocket clients might send JSON as a string)
        guard let data = str.data(using: .utf8) else { return }
        
        // Deserialize JSON
        guard let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String : Any] else {
            Log.error("Malformed JSON string received by websocket: \(str)")
            return
        }
        
        // Decode message object
        guard let message = InboundMessage(json: json) else {
            Log.error("Unsupported message type received by websocket: \(json)")
            return
        }
        
        // Handle message
        handleIncomingMessage(message)
    }
    
    
    /// Called when an incoming message (as raw data) is received from a client.
    static func incomingData(session: WebSocketSession, bytes: [UInt8]) {
        // Convert to native Data format
        let data = Data(bytes)
        
        // Deserialize JSON
        guard let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String : Any] else {
            Log.error("Malformed JSON data received by websocket.")
            return
        }
        
        // Decode message object
        guard let message = InboundMessage(json: json) else {
            Log.error("Unsupported message type received by websocket: \(json)")
            return
        }
        
        // Handle message
        handleIncomingMessage(message)
    }
    
    
    /// Handles an incoming message from a client.
    private static func handleIncomingMessage(_ message: InboundMessage) {
        switch message {
        case .startRecording:
            DispatchQueue.main.async {
                ScreenRecorder.shared.start()
            }
            
        case .stopRecording:
            DispatchQueue.main.async {
                ScreenRecorder.shared.stop()
            }
            
        case .setBounds(let bounds):
            guard bounds.minX >= 0, bounds.minY >= 0, !bounds.isEmpty else {
                Log.error("Invalid bounds received: \(bounds)")
                return
            }
            DispatchQueue.main.async {
                ScreenRecorder.shared.watchBounds(bounds)
            }
            
        case .setFPS(let fps):
            guard fps > 0 && fps <= 60 else {
                Log.error("Invalid FPS received: \(fps)")
                return
            }
            DispatchQueue.main.async {
                ScreenRecorder.shared.setFPS(fps)
            }
            
        case .startObservingWindows:
            DispatchQueue.main.async {
                WindowManager.shared.startObservingEvents()
            }
            
        case .stopObservingWindows:
            DispatchQueue.main.async {
                WindowManager.shared.stopObservingEvents()
            }
        }
    }
    
}

//
//  TrayManager.swift
//  Oracle
//
//  Created by Nathan Weinert on 11/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa
import Swindler
import AXSwift

struct TrayItem {
    var index: Int
    var id: String
    var width: Int
    var spaceBefore: Int
}

/// Manages observation of macOS window events.
class TrayManager {

    /// Shared instance.
    static let shared = TrayManager()
    
    /// Tray state
    private let statusItem = NSStatusBar.system.statusItem(withLength:NSStatusItem.variableLength)
    private var lastTrayBoundsMessage = ""
    private var trayLocation = "Out"
    private var lastHoverEvent = ""
    private let trayItems: [TrayItem] = [
        // [id, width, spaceBefore]
        TrayItem(index: 0, id: "3", width: 28, spaceBefore: 0),
        TrayItem(index: 1, id: "2", width: 28, spaceBefore: 0),
        TrayItem(index: 2, id: "1", width: 28, spaceBefore: 0),
        TrayItem(index: 3, id: "0", width: 28, spaceBefore: 10),
    ]
    
    func setupTray() {
        print("setup tray")
        statusItem.highlightMode = false
        let button = statusItem.button!
        button.image = NSImage(named:NSImage.Name("tray"))
        button.action = #selector(self.handleTrayClick(_:))
        button.target = self


        // setup hover events
        let throttleHoverQueue = DispatchQueue.global(qos: .background)
        let throttledHover =  throttle(delay: 0.03, queue: throttleHoverQueue, action: self.handleTrayHover)
        var lastTrayRect = [0, 0]
        let rectInWindow = button.convert(button.bounds, to: nil)
        
        NSEvent.addGlobalMonitorForEvents(matching: [.mouseMoved]) { (event) in
            let height = (NSScreen.main?.frame.height)!
            let mouseLocation = (event.cgEvent?.location)!
            let invMouseLocation = NSPoint.init(x: mouseLocation.x, y: height - mouseLocation.y)

            let ogTrayRect = button.window!.convertToScreen(rectInWindow)

                // our tray image is a few px too short oops...
            let trayRect = NSRect.init(x: ogTrayRect.minX, y: ogTrayRect.minY - 2, width: ogTrayRect.width, height: ogTrayRect.height + 2)
            let nextTrayRect = [Int(round(trayRect.minX)), Int(round(trayRect.maxX))]

            // send tray location...
            if (nextTrayRect[0] != lastTrayRect[0] || nextTrayRect[1] != lastTrayRect[1]) {
                lastTrayRect = nextTrayRect
//                self.lastTrayBoundsMessage = "{ \"action\": \"trayState\", \"value\": { \"trayBounds\": [\(nextTrayRect[0]), \(nextTrayRect[1])] } }"
                Socket.send(.trayBounds(top: 0, left: nextTrayRect[0], width: nextTrayRect[1] - nextTrayRect[0], height: 28))
            }

            // handle events
            self.trayLocation = self.getTrayLocation(mouseLocation: invMouseLocation, trayRect: trayRect)

            // avoid sending more than one out event
            if (self.lastHoverEvent == self.trayLocation) {
                return
            }

            self.lastHoverEvent = self.trayLocation
            print("last location \(self.lastHoverEvent)")

            switch self.trayLocation {
            case "Out":
                self.statusItem.button!.image = NSImage(named:NSImage.Name("tray"))
            case "0":
                self.statusItem.button!.image = NSImage(named:NSImage.Name("trayHover0"))
            case "1":
                self.statusItem.button!.image = NSImage(named:NSImage.Name("trayHover1"))
            case "2":
                self.statusItem.button!.image = NSImage(named:NSImage.Name("trayHover2"))
            case "3":
                self.statusItem.button!.image = NSImage(named:NSImage.Name("trayHover3"))
            default:
                break
            }

            throttledHover((self.trayLocation))
        }
    
    }

    @objc func handleTrayClick(_ sender: Any?) {
        print("handleTrayClick \(trayLocation)")
        if trayLocation != "Out" {
            Socket.send(.trayClicked(id: trayLocation))
        }
    }

    func handleTrayHover(id: String) {
        print("handleTrayHover \(id)")
        Socket.send(.trayHovered(id: id))
    }
    
    func getTrayLocation(mouseLocation: NSPoint, trayRect: NSRect) -> String {
        let mouseX = mouseLocation.x
        let mouseY = mouseLocation.y
        let trayOffsetBeginning = 27
        let trayButtonMaxX = trayItems.map({ (ti: TrayItem) -> Int in
            return trayOffsetBeginning + (ti.width * (ti.index + 1)) + ti.spaceBefore
        })
        let withinX = mouseX >= trayRect.minX && mouseX <= trayRect.maxX
        // if mouse is currently over the menu, we should extend the bounds down
        // because by default we have a couple pixels between the tray item and the menu
        // and so you'd trigger hide while going down to menu
        // we want this gap because we don't want the initial hover-in bounds to be too low
        // so when the previous/current location is already "in" we add a few px downwards to bounds
        let yForgiveness = CGFloat(trayLocation != "Out" ? 4 : 0)
        let withinY = mouseY >= trayRect.minY - yForgiveness && mouseY <= trayRect.maxY
        if (withinX && withinY) {
            let xOff = Int(trayRect.width) - Int(trayRect.maxX - mouseX)
            if (xOff < trayOffsetBeginning) {
                return "Out"
            }
            for (index, maxX) in trayButtonMaxX.enumerated() {
                if (xOff < maxX) {
                    return self.trayItems[index].id
                }
            }
        }
        return "Out"
    }

}


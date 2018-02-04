//
//  AppDelegate.swift
//  SwindlerExample
//
//  Created by Tyler Mandry on 10/20/15.
//  Copyright © 2015 Tyler Mandry. All rights reserved.
//

import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import Swindler
import PromiseKit
import Darwin

class AppDelegate: NSObject, NSApplicationDelegate {
    var swindler: Swindler.State!
    var observer: Observer!
    
    private var lastSent = ""

    func emit(_ msg: String) {
        if msg != lastSent {
            fputs("\(msg)\n", __stderrp)
        }
        lastSent = msg
    }

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        emit("Loading");
        guard AXSwift.checkIsProcessTrusted(prompt: true) else {
            emit("Not trusted as an AX process; please authorize and re-launch")
            NSApp.terminate(self)
            return
        }
        
        swindler = Swindler.state
        swindler.on { (event: WindowCreatedEvent) in
            let window = event.window
            self.emit(":WindowCreatedEvent \(window.title.value)")
        }
        swindler.on { (event: WindowPosChangedEvent) in
            self.emit(":WindowPosChangedEvent \(event.newValue)")
        }
        swindler.on { (event: WindowSizeChangedEvent) in
            self.emit(":WindowSizeChangedEvent \(event.newValue)")
        }
        swindler.on { (event: WindowDestroyedEvent) in
            self.emit(":WindowDestroyedEvent \(event.window.title.value)")
        }
        swindler.on { (event: ApplicationMainWindowChangedEvent) in
            self.frontmostWindowChanged()
        }
        swindler.on { (event: FrontmostApplicationChangedEvent) in
            if event.newValue != nil {
                self.frontmostWindowChanged()
            }
        }
        swindler.on { (event: WindowTitleChangedEvent) in
            self.frontmostWindowChanged()
        }
        
        // send current app immediately
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            self.frontmostWindowChanged()
        }
    }

    private func frontmostWindowChanged() {
        let app = swindler.frontmostApplication.value!
        let frontWindow = app.mainWindow.value
        if (frontWindow == nil) { return }
        let window = frontWindow!
        let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
        let titleString = "\"\(title)\"";
        let offset = window.position.value
        let bounds = window.size.value
        let id = app.bundleIdentifier
        self.emit(":FrontmostWindowChangedEvent { \"id\": \"\(id ?? "")\", \"title\": \(titleString), \"offset\": [\(offset.x),\(offset.y)], \"bounds\": [\(bounds.width),\(bounds.height)] }")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        print("terminating swindelr")
        emit("Exit");
    }
}

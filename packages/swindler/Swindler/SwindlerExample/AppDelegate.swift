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

func dispatchAfter(delay: TimeInterval, block: DispatchWorkItem) {
    let time = DispatchTime.now() + delay
    DispatchQueue.main.asyncAfter(deadline: time, execute: block)
}

class AppDelegate: NSObject, NSApplicationDelegate {
    var swindler: Swindler.State!
    var observer: Observer!

    func emit(_ firstThing: String) {
        fputs("\(firstThing)\n", __stderrp)
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
//            self.emit(":ApplicationMainWindowChangedEvent \(String(describing: event.newValue?.title.value))")
            self.frontmostWindowChanged("")
        }
        swindler.on { (event: FrontmostApplicationChangedEvent) in
            if event.newValue != nil {
                let id = (event.newValue!.bundleIdentifier ?? "").replacingOccurrences(of: "\"", with: "")
                let idString = (id != "") ?
                    "\"id\": \"\(String(describing: id))\", " : ""
                self.frontmostWindowChanged(idString)
            }
        }
        swindler.on { (event: WindowTitleChangedEvent) in
            self.frontmostWindowChanged("")
        }
    }

    private func frontmostWindowChanged(_ extraString: String) {
        let frontWindow = swindler.frontmostApplication.value?.mainWindow.value!
        if (frontWindow == nil) { return }
        let window = frontWindow!
        let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
        let titleString = "\"\(title)\"";
        let offset = window.position.value
        let bounds = window.size.value
        self.emit(":FrontmostWindowChangedEvent { \(extraString) \"title\": \(titleString), \"offset\": [\(offset.x),\(offset.y)], \"bounds\": [\(bounds.width),\(bounds.height)] }")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        print("terminating swindelr")
        emit("Exit");
    }
}

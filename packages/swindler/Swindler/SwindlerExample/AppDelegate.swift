//
//  AppDelegate.swift
//  SwindlerExample
//
//  Created by Tyler Mandry on 10/20/15.
//  Copyright © 2015 Tyler Mandry. All rights reserved.
//

import AXSwift
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

    func emit(_ firstThing: String) {
        fputs(firstThing, __stderrp)
    }

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        emit("Loading");
        guard AXSwift.checkIsProcessTrusted(prompt: true) else {
            emit("Not trusted as an AX process; please authorize and re-launch")
            NSApp.terminate(self)
            return
        }

        swindler = Swindler.state

//        emit("screens: \(swindler.screens)")

        swindler.on { (event: WindowCreatedEvent) in
            let window = event.window
            self.emit("new window: \(window.title.value)")
        }
        swindler.on { (event: WindowPosChangedEvent) in
            self.emit("Pos changed from \(event.oldValue) to \(event.newValue), external: \(event.external)")
        }
        swindler.on { (event: WindowSizeChangedEvent) in
            self.emit("Size changed from \(event.oldValue) to \(event.newValue), external: \(event.external)")
        }
        swindler.on { (event: WindowDestroyedEvent) in
            self.emit("window destroyed: \(event.window.title.value)")
        }
        swindler.on { (event: ApplicationMainWindowChangedEvent) in
            self.emit("new main window: \(String(describing: event.newValue?.title.value)). [old: \(String(describing: event.oldValue?.title.value))]")
            self.frontmostWindowChanged()
        }
        swindler.on { (event: FrontmostApplicationChangedEvent) in
            self.emit("new frontmost app: \(event.newValue?.bundleIdentifier ?? "unknown"). [old: \(event.oldValue?.bundleIdentifier ?? "unknown")]")
            self.frontmostWindowChanged()
        }

        //    dispatchAfter(10.0) {
        //      for window in self.swindler.knownWindows {
        //        let title = window.title.value
        //        emit("resizing \(title)")
        //        window.size.set(CGSize(width: 200, height: 200)).then { newValue in
        //          emit("done with \(title), valid: \(window.isValid), newValue: \(newValue)")
        //        }.error { error in
        //          emit("failed to resize \(title), valid: \(window.isValid), error: \(error)")
        //        }
        //      }
        //    }
    }

    private func frontmostWindowChanged() {
        let window = swindler.frontmostApplication.value?.mainWindow.value
        self.emit("new frontmost window: \(String(describing: window?.title.value))")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
        self.emit("going to terminate yo");
    }
}

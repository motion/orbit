//
//  main.swift
//  SwindlerCLI
//
//  Created by Nathan Wienert on 1/11/18.
//  Copyright © 2018 Tyler Mandry. All rights reserved.
//

import Foundation
//import Swindler
//import AXSwift

func run() {
    print("HI")
//    guard AXSwift.checkIsProcessTrusted(prompt: true) else {
//        print("Not trusted as an AX process; please authorize and re-launch")
//        exit(1)
//    }
    
//    var swindler = Swindler.state
//    
//    func frontmostWindowChanged() {
//        let window = swindler.frontmostApplication.value?.mainWindow.value
//        print("new frontmost window: \(String(describing: window?.title.value))")
//    }
//
//    print("screens: \(swindler.screens)")
//
//    swindler.on { (event: WindowCreatedEvent) in
//        let window = event.window
//        print("new window: \(window.title.value)")
//    }
//    swindler.on { (event: WindowPosChangedEvent) in
//        print("Pos changed from \(event.oldValue) to \(event.newValue),",
//            "external: \(event.external)")
//    }
//    swindler.on { (event: WindowSizeChangedEvent) in
//        print("Size changed from \(event.oldValue) to \(event.newValue),",
//            "external: \(event.external)")
//    }
//    swindler.on { (event: WindowDestroyedEvent) in
//        print("window destroyed: \(event.window.title.value)")
//    }
//    swindler.on { (event: ApplicationMainWindowChangedEvent) in
//        print("new main window: \(String(describing: event.newValue?.title.value)).",
//            "[old: \(String(describing: event.oldValue?.title.value))]")
//        frontmostWindowChanged()
//    }
//    swindler.on { (event: FrontmostApplicationChangedEvent) in
//        print("new frontmost app: \(event.newValue?.bundleIdentifier ?? "unknown").",
//            "[old: \(event.oldValue?.bundleIdentifier ?? "unknown")]")
//        frontmostWindowChanged()
//    }
}

run()

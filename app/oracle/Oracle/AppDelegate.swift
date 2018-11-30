//
//  AppDelegate.swift
//  Oracle
//
//  Created by Collin Hundley on 9/28/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa


class AppDelegate: NSObject, NSApplicationDelegate {

    @IBOutlet weak var window: NSWindow!


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        
        // Start websocket server
        do {
            try Socket.start()
        } catch {
            Log.error(error.localizedDescription)
        }
        
        
        // Start observing window changes
//        WindowManager.shared.startObservingEvents()
        
        // Start recording screen
//        ScreenRecorder.shared.start()
//        ScreenRecorder.shared.watchBounds(CGRect(x: 0, y: 0, width: 1400, height: 1600))
        
    }
    

    func applicationWillTerminate(_ aNotification: Notification) {
        // Stop recording screen
        // This will stop anyway when the app terminates, but whatever
        ScreenRecorder.shared.stop()
    }


}


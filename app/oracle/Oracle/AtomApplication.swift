//
//  AppDelegate.swift
//  Oracle
//
//  Created by Collin Hundley on 9/28/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa


/*
    -------- DEBUGGING/TESTING FLAGS --------
 
    shouldLogDebug: If true, debug and performance messages will be logged to the console.
 
    shouldLogOCR: If true, the final OCR output for each frame will be logged to the console.
 
    shouldSaveDebugImages: If true, various images will be saved to the `Test-Output` directory.
                           This has a significant performance impact, so all performance logs
                           can be disregarded while this flag is enabled.
 
    shouldUseCache: If true, the OCR cache will be used as intended.
                    If false, the cache will be disabled.
                    This is sometimes useful for debugging purposes.

*/


/// Set this to `true` to log debug/performance messages.
/// Not recommended for production builds.
let shouldLogDebug = false

/// Set this to `true` to log the final OCR output for each frame.
/// Disable for production builds.
let shouldLogOCR = false

/// Set this to `true` to save character boxes and other debug images
/// to the test output directory.
/// Disable for production builds.
let shouldSaveDebugImages = false

/// This should normally be set to `true`.
/// If `false`, the OCR cache will not be used.
let shouldUseCache = true


/*
    -----------------------------------------
*/


class AtomApplication: NSObject, NSApplicationDelegate {

    @IBOutlet weak var window: NSWindow!


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        
        // Start websocket server
        do {
            try Socket.connect()
        } catch {
            Log.error(error.localizedDescription)
        }
        
        // Setup tray
        TrayManager.shared.setupTray()
        
        // Testing
//        OCRTester.shared.testScreenshots()
//        OCRTester.shared.watchBounds(CGRect(x: 0, y: 100, width: 1000, height: 2000))
    }
    

    func applicationWillTerminate(_ aNotification: Notification) {
        // Stop recording screen
        // This will stop anyway when the app terminates, but whatever
        ScreenRecorder.shared.stop()
    }


}


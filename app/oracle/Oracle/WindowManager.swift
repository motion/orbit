//
//  WindowManager.swift
//  Oracle
//
//  Created by Collin Hundley on 10/1/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa
import Swindler
import AXSwift


/// Manages observation of macOS window events.
class WindowManager {
    
    /// Shared instance.
    static let shared = WindowManager()
    
    
    // STATE VARIABLES/CACHES
    
    /// This wrapper represents the entire state of the OS, including all windows, applications and spaces.
    fileprivate var state: Swindler.State!
    
    /// The previous frontmost application, if any.
    fileprivate var previousFrontmostApplication: NSRunningApplication?
    
    /// The current frontmost application.
    fileprivate var currentFrontmostApplication: NSRunningApplication?
    
    /// The window of the current frontmost app.
    fileprivate var currentFrontWindow: Window?
    
    /// The last recorded time that the user scrolled the scrollwheel.
    fileprivate var lastScrollTime: DispatchTime
    
    /// State variable - tracks whether we've already added observers.
    fileprivate var isObservingEvents = false
    
    /// If `true`, all system events will be ignored.
    fileprivate var shouldIgnoreEvents = true
    
    
    private init() {
        lastScrollTime = DispatchTime.now()
        
        // Init Swindler
        Swindler.initialize().done { (state) in
            self.state = state
        }.catch { error in
            Log.error("Unable to start WindowManager (Swindler initialization failed): \(error.localizedDescription)")
            fatalError(error.localizedDescription)
        }
    }

}


// MARK: Public API

extension WindowManager {
    
    /// Begins observing system-wide window events.
    /// Should only be called from the main queue.
    func startObservingEvents() {
        Log.info("Starting window observation")
        
        // Disable flag
        self.shouldIgnoreEvents = false
        
        // Setup observers if this is the first time being enabled.
        if !self.isObservingEvents {
            self.setupEventObservers()
            self.isObservingEvents = true
        }
    }
    
    
    /// Stops observing all system window events until future notice.
    /// Should only be called from the main queue.
    func stopObservingEvents() {
        Log.info("Stopping window observation")
        
        // NOTE: Swindler doesn't seem to support removing event observations.
        // So, here we simply set a flag telling our event handlers to ignore all events.
        self.shouldIgnoreEvents = true
    }
    
    
    /// This should only be called once, the first time `start` is called.
    private func setupEventObservers() {
        // Request permission from user if needed
        getPermissionIfNeeded()
        
        // Observe scrolling events
        observeScrolling()
        
        // Delay 1 second - Swindler has issues if started immediately
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1) {
            self.observeFrontmostApplication()
            self.observeWindowChanges()
            self.observeWindowFrame()
            self.observeWindowTitle()
        }
    }
    
}


// MARK: Event handlers

fileprivate extension WindowManager {

    /// Begins global observation of scrollwheel scrolling events.
    /// NOTE: This observer is triggered ANYTIME the scrollwheel is moved,
    /// even if there's no scrollable content.
    private func observeScrolling() {
        NSEvent.addGlobalMonitorForEvents(matching: .scrollWheel) { [unowned self] (event) in
            // Make sure we're not ignoring events
            guard !self.shouldIgnoreEvents else { return }
            // Compute elapsed time since last scroll event
            let msSinceLast = (DispatchTime.now().uptimeNanoseconds - self.lastScrollTime.uptimeNanoseconds) / 1_000_000
            // If it's been at least 200ms, record new scroll time
            if msSinceLast > 200 {
                self.lastScrollTime = DispatchTime.now()
            }
        }
    }


    /// Observes changes to the current frontmost (active) application.
    private func observeFrontmostApplication() {
        state.on { [unowned self] (event: FrontmostApplicationChangedEvent) in
            // Make sure we're not ignoring events
            guard !self.shouldIgnoreEvents else { return }
            if event.newValue == nil { return }
            self.previousFrontmostApplication = self.currentFrontmostApplication
            self.currentFrontmostApplication = NSWorkspace.shared.frontmostApplication
            self.frontmostWindowChanged()
        }
    }


    /// Observes changes to the active window of the frontmost application.
    /// (i.e. the user focuses on a different window of the same application).
    private func observeWindowChanges() {
        state.on { [unowned self] (event: ApplicationMainWindowChangedEvent) in
            // Make sure we're not ignoring events
            guard !self.shouldIgnoreEvents else { return }
            self.frontmostWindowChanged()
        }
    }


    /// Observes changes to the frontmost application's main window frame.
    private func observeWindowFrame() {
        state.on { (event: WindowFrameChangedEvent) in
            // Make sure we're not ignoring events
            guard !self.shouldIgnoreEvents else { return }
            let position = CGPoint(x: event.newValue.minX, y: event.newValue.minY)
            let size = event.window.size.value
            // Broadcast message
            Socket.send(.windowMoved(size: size, position: position))
        }
    }


    /// Observes changes to the frontmost application's window title.
    private func observeWindowTitle() {
        state.on { [unowned self] (event: WindowTitleChangedEvent) in
            // Make sure we're not ignoring events
            guard !self.shouldIgnoreEvents else { return }
            self.frontmostWindowChanged()
        }
    }
    
}


// MARK: Accessibility/Permissions

fileprivate extension WindowManager {
    
    /// Checks system accessibility permissions, and displays a prompt to the user
    /// if permission has not yet been granted.
    func getPermissionIfNeeded() {
        if !AXSwift.checkIsProcessTrusted(prompt: true) {
            // Permission not granted; user will be prompted automatically
            Log.error("\n\nWARNING: ACCESSIBILITY PERMISSION HAS NOT BEEN GRANTED.")
            Log.error("Oracle will not function correctly until permission has been given.\n\n")
        }
    }
    
}


// MARK: Window position management

fileprivate extension WindowManager {
    
    /// Should be called when we receive notification that the frontmost application
    /// has changed, OR the main window of the same application.
    func frontmostWindowChanged() {
        // Store reference to new front window
        guard let app = state.frontmostApplication.value else { return }
        guard let window = app.mainWindow.value else { return }
        currentFrontWindow = window
        
        // Extract info
        let title = window.title.value.replacingOccurrences(of: "\"", with: "")
        let position = window.frame.value.origin
        let size = window.size.value

        // Broadcast message
        Socket.send(.windowChanged(title: title, size: size, position: position))
    }
    
}

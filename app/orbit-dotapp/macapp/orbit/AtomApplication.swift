import Cocoa
import Darwin

class AtomApplication: NSObject, NSApplicationDelegate {
  var socketBridge: SocketBridge!

  lazy var window = NSWindow(
    contentRect: NSMakeRect(1413, 0, 500, 900),
    styleMask: [],
    backing: .buffered,
    defer: false,
    screen: nil
  )

  private func emit(_ msg: String) {
    self.socketBridge.send(msg)
  }
  
  func applicationWillBecomeActive(_ notification: Notification) {
    self.emit("{ \"action\": \"appState\", \"value\": \"focus\" }")
    // hide it immediately, we never want to "really" focus this window we just move to Orbit
    NSApp.hide(nil)
  }
  
  func applicationWillResignActive(_ notification: Notification) {
    self.emit("{ \"action\": \"appState\", \"value\": \"blur\" }")
  }
  
  func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
    self.emit("{ \"action\": \"appState\", \"value\": \"exit\" }")
    return NSApplication.TerminateReply.terminateNow
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    print("applicationDidFinishLaunching PORT: \(ProcessInfo.processInfo.environment["SOCKET_PORT"] ?? "")")

    // setup socket bridge before any action that needs it...
    socketBridge = SocketBridge(queue: self.queue, onMessage: self.onMessage)

    if shouldRunAppWindow {
      window.level = .floating // .floating to be on top
      window.backgroundColor = NSColor.clear
      window.alphaValue = 0
      window.isOpaque = false
      window.titlebarAppearsTransparent = true
      window.titleVisibility = .hidden
      window.setFrameOrigin(NSPoint.init(x: 0, y: 0))
      window.isMovableByWindowBackground = false
      window.collectionBehavior = .managed
      window.ignoresMouseEvents = true
      // allow showing icon in sub-apps
      if ProcessInfo.processInfo.environment["SHOW_ICON"] != nil {
        NSApp.setActivationPolicy(NSApplication.ActivationPolicy.regular)
        self.setIcon(ProcessInfo.processInfo.environment["SHOW_ICON"]!)
      }
      window.makeKeyAndOrderFront(nil)
    }
    
    print("finished running app window")
  }
  
  func setIcon(_ path: String) {
    NSApp.applicationIconImage = NSImage.init(contentsOfFile: path)
  }

  func applicationWillTerminate(_ aNotification: Notification) {
    print("recorder stopped, exiting...")
  }
}

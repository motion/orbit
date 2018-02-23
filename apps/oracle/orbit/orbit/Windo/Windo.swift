import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import Swindler
import PromiseKit
import Darwin

final class Windo {
  var emit: (String)->Void
  var swindler: Swindler.State
  var observer: Observer!
  private var lastApp: NSRunningApplication?
  private var currentApp: NSRunningApplication?
  private var lastSent = ""
  @IBOutlet weak var window: NSWindow!
  
  init(emit: @escaping (String)->Void) {
    self.emit = emit
    self.swindler = Swindler.state

    var lastScroll = DispatchTime.now()
    NSEvent.addGlobalMonitorForEvents(matching: NSEvent.EventTypeMask.scrollWheel, handler: { event in
      let msSinceLast = Int(Double(DispatchTime.now().uptimeNanoseconds - lastScroll.uptimeNanoseconds) / 1_000_000)
      if msSinceLast > 200 {
        self.emit("{ \"action\": \"ScrollEvent\" }") // \(DispatchTime.now().rawValue)
        lastScroll = DispatchTime.now()
      }
    })

    // swindler bugs if started too quickly :/
    DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
      self.frontmostWindowChanged()
      
      self.swindler.on { (event: WindowCreatedEvent) in
        let window = event.window
        self.emit("{ \"action\": \"WindowCreatedEvent\", \"value\": \"\(window.title.value)\" }")
      }
      self.swindler.on { (event: WindowPosChangedEvent) in
        let val = event.newValue
        self.emit("{ \"action\": \"WindowPosChangedEvent\", \"value\": { \"id\": \"\(event.window.application.bundleIdentifier ?? "")\", \"pos\": [\(val.x), \(val.y)] } }")
      }
      self.swindler.on { (event: WindowSizeChangedEvent) in
        let val = event.newValue
        self.emit("{ \"action\": \"WindowSizeChangedEvent\", \"value\": { \"id\": \"\(event.window.application.bundleIdentifier ?? "")\", \"size\": [\(val.width), \(val.height)] } }")
      }
      self.swindler.on { (event: WindowDestroyedEvent) in
        self.emit("{ \"action\": \"WindowDestroyedEvent\", \"value\": \"\(event.window.title.value)\" }")
      }
      self.swindler.on { (event: ApplicationMainWindowChangedEvent) in
        //      self.frontmostWindowChanged()
      }
      self.swindler.on { (event: FrontmostApplicationChangedEvent) in
        if event.newValue == nil { return }
        self.lastApp = self.currentApp
        self.currentApp = NSWorkspace.shared.frontmostApplication
        self.frontmostWindowChanged()
      }
      self.swindler.on { (event: WindowTitleChangedEvent) in
        self.frontmostWindowChanged()
      }
    }
  }
  
  // sends focus to last app besides our app
  public func defocus() {
//    print("defocus \(self.lastApp?.bundleIdentifier ?? "") \(self.currentApp?.bundleIdentifier ?? "")")
    if let app = self.lastApp {
      app.activate(options: .activateIgnoringOtherApps)
    }
  }
  
  private func frontmostWindowChanged() {
    guard let app = swindler.frontmostApplication.value else {
      print("no frontmost window")
      return
    }
    let frontWindow = app.mainWindow.value
    if (frontWindow == nil) { return }
    let window = frontWindow!
    let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
    let titleString = "\"\(title)\"";
    let offset = window.position.value
    let bounds = window.size.value
    let id = app.bundleIdentifier
    self.emit("{ \"action\": \"FrontmostWindowChangedEvent\", \"value\": { \"id\": \"\(id ?? "")\", \"title\": \(titleString), \"offset\": [\(offset.x),\(offset.y)], \"bounds\": [\(bounds.width),\(bounds.height)] } }")
  }
  
}



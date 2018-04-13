import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import Swindler
import PromiseKit
import Darwin

enum Either<T1, T2> {
  case Left(T1)
  case Right(T2)
}

let orbitAppId = "com.github.electron"

final class Windo {
  var emit: (String)->Void
  var swindler: Swindler.State
  var observer: Observer!
  private var currentId = ""
  private var lastApp: NSRunningApplication?
  private var currentApp: NSRunningApplication?
  private var currentFrontWindow: Window?
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
    DispatchQueue.main.asyncAfter(deadline: .now() + 6) {
      self.frontmostWindowChanged()

//      self.swindler.on { (event: WindowCreatedEvent) in
//        let window = event.window
//        if window.application.bundleIdentifier == orbitAppId { return }
//        self.emit("{ \"action\": \"WindowCreatedEvent\", \"value\": \"\(window.title.value)\" }")
//      }
      self.swindler.on { (event: WindowPosChangedEvent) in
        self.updatePosition(event.window, size: nil, position: [Int(event.newValue.x), Int(event.newValue.y)])
      }
      self.swindler.on { (event: WindowSizeChangedEvent) in
        self.updatePosition(event.window, size: [Int(event.newValue.width), Int(event.newValue.height)], position: nil)
      }
//      self.swindler.on { (event: WindowDestroyedEvent) in
//        let window = event.window
//        if window.application.bundleIdentifier == orbitAppId { return }
//        self.emit("{ \"action\": \"WindowDestroyedEvent\", \"value\": \"\(window.title.value)\" }")
//      }
      self.swindler.on { (event: ApplicationMainWindowChangedEvent) in
        self.frontmostWindowChanged()
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
  
  private func updatePosition(_ window: Window, size: [Int]?, position: [Int]?) {
    let movingApp = window.application
    let bundleId = movingApp.bundleIdentifier ?? ""
    if bundleId == orbitAppId { return }
    if bundleId != self.currentId { return }
    let position = position ?? [Int(window.position.value.x), Int(window.position.value.y)]
    let size = size ?? [Int(window.size.value.width), Int(window.size.value.height)]
    self.emit("{ \"action\": \"WindowPosChangedEvent\", \"value\": { \"id\": \"\(bundleId)\", \"size\": [\(size[0]), \(size[1])], \"position\": [\(position[0]), \(position[1])] } }")
  }
  
  // sends focus to last app besides our app
  public func defocus() {
    if self.currentId != orbitAppId {
      return
    }
    if let app = self.lastApp {
      app.activate(options: .activateIgnoringOtherApps)
    }
  }
  
  private func frontmostWindowChanged() {
    guard let app = swindler.frontmostApplication.value else {
      print("no frontmost window")
      return
    }
    guard let window = app.mainWindow.value else {
      print("no main window")
      return
    }
    let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
    let titleString = "\"\(title)\"";
    let offset = window.position.value
    let bounds = window.size.value
    let id = app.bundleIdentifier ?? ""
    self.currentId = id
    self.emit("{ \"action\": \"FrontmostWindowChangedEvent\", \"value\": { \"id\": \"\(id)\", \"title\": \(titleString), \"offset\": [\(offset.x),\(offset.y)], \"bounds\": [\(bounds.width),\(bounds.height)] } }")
  }
  
}



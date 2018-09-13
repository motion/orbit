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

let orbitAppId = "com.o.orbit"

final class Windo {
  var emit: (String)->Void
  var swindler: Swindler.State
  var observer: Observer!
  private var started = false
  private var currentId = ""
  private var lastApp: NSRunningApplication?
  private var currentApp: NSRunningApplication?
  private var currentFrontWindow: Window?
  private var lastSent = ""
  @IBOutlet weak var window: NSWindow!
  private weak var accessibilityTimer: Timer?
  private var hasPromptedAccessibility = false
  
  init(emit: @escaping (String)->Void) {
    self.emit = emit
    self.swindler = Swindler.state

    self.checkAccessibility()
    // TODO: prompt again in certain cases, ideally make this prompt controllable from oracle.ts
    self.hasPromptedAccessibility = true
    
//    self.accessibilityTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
//      if self != nil {
//        self!.checkAccessibility()
//      }
//    }

    var lastScroll = DispatchTime.now()
    NSEvent.addGlobalMonitorForEvents(matching: NSEvent.EventTypeMask.scrollWheel, handler: { event in
      let msSinceLast = Int(Double(DispatchTime.now().uptimeNanoseconds - lastScroll.uptimeNanoseconds) / 1_000_000)
      if msSinceLast > 200 {
        self.emit("{ \"action\": \"ScrollEvent\" }") // \(DispatchTime.now().rawValue)
        lastScroll = DispatchTime.now()
      }
    })
  }

  @objc private func checkAccessibility() {
    if !AXSwift.checkIsProcessTrusted(prompt: !self.hasPromptedAccessibility) {
      if started {
        self.stop()
      }
      print("Not trusted as an AX process; please authorize and re-launch")
      self.emit("{ \"action\": \"accessible\", \"value\": false }")
    } else {
      if !started {
        self.start()
      }
      self.emit("{ \"action\": \"accessible\", \"value\": true }")
    }
  }
  
  private func stop() {
    self.started = false
    print("Need to figure out how to stop Swindler cleanly...")
  }
  
  private func start() {
    self.started = true
    let app = NSWorkspace.shared.frontmostApplication!
    let x = try? Observer(processID: app.processIdentifier, callback: { (a: Observer, b: UIElement, c: AXNotification, d: [String : AnyObject]?) in
      let x = try? b.attributesAsStrings()
      print("ok \(x!)")
    })
    if (x != nil) { print("\(x!)") }
    
    // swindler bugs if started too quickly :/
    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
      self.frontmostWindowChanged()
//      self.swindler.on { (event: WindowCreatedEvent) in
//        let window = event.window
//        if window.application.bundleIdentifier == orbitAppId { return }
//        self.emit("{ \"action\": \"WindowCreatedEvent\", \"value\": \"\(window.title.value)\" }")
//      }
      self.swindler.on { (event: WindowPosChangedEvent) in
        let position = [Int(event.newValue.x), Int(event.newValue.y)]
        print("pos changed \(position)")
        self.updatePosition(event.window, size: nil, position: position)
      }
      self.swindler.on { (event: WindowSizeChangedEvent) in
        let size = [Int(event.newValue.width), Int(event.newValue.height)]
        let position = self.getPosition() ?? [Int(event.window.position.value.x), Int(event.window.position.value.y)]
        self.updatePosition(event.window, size: size, position: position)
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

  private func getPosition() -> [Int]? {
    var position: [Int]? = nil
    NSWorkspace.shared.frontmostApplication!.windows.forEach {
      guard let cur = self.currentFrontWindow else { return }
      // ensure we have the right window, its hacky
      if (cur.title.value != $0.title) { return }
      if (cur.size.value.width != $0.frame.width) { return }
      if (cur.size.value.height != $0.frame.height) { return }
      position = [Int($0.origin.x), Int($0.origin.y)]
    }
    return position
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
    print("docus \(self.currentId)")
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
    self.currentFrontWindow = window
    let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
    let titleString = "\"\(title)\"";
    let position = self.getPosition() ?? [Int(window.position.value.x), Int(window.position.value.y)]
    let size = window.size.value
    let id = app.bundleIdentifier ?? ""
    self.currentId = id
    self.emit("{ \"action\": \"FrontmostWindowChangedEvent\", \"value\": { \"id\": \"\(id)\", \"title\": \(titleString), \"position\": [\(position[0]),\(position[1])], \"size\": [\(size.width),\(size.height)] } }")
  }
  
}



import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import PromiseKit
import Darwin

enum InterfaceStyle : String {
  case Dark, Light
  init() {
    let type = UserDefaults.standard.string(forKey: "AppleInterfaceStyle") ?? "Light"
    self = InterfaceStyle(rawValue: type)!
  }
}

// super hack: node doesnt see the stdout for who knows what reason
// so we re-route everything to stderr with a ! in front
// cringe alert

func print(_ items: Any..., separator: String = " ", terminator: String = "\n") {
  //  Swift.print(items[0], separator:separator, terminator: terminator)
  fputs("!\(items.map { "\($0)" }.joined(separator: separator))\(terminator)", __stderrp)
}

struct Position: Decodable {
  let x: Int
  let y: Int
  let width: Int
  let height: Int
}

struct Words: Decodable {
  let words: String
  let id: Int
}

struct WordsReply: Codable {
  let words: String
  let id: Int
}

extension TimeInterval {
  func hasPassed(since: TimeInterval) -> Bool {
    return Date().timeIntervalSinceReferenceDate - self > since
  }
}

func throttle<T>(delay: TimeInterval, queue: DispatchQueue = .main, action: @escaping ((T) -> Void)) -> (T) -> Void {
  var currentWorkItem: DispatchWorkItem?
  var lastFire: TimeInterval = 0
  return { (p1: T) in
    guard currentWorkItem == nil else { return }
    currentWorkItem = DispatchWorkItem {
      action(p1)
      lastFire = Date().timeIntervalSinceReferenceDate
      currentWorkItem = nil
    }
    delay.hasPassed(since: lastFire) ? queue.async(execute: currentWorkItem!) : queue.asyncAfter(deadline: .now() + delay, execute: currentWorkItem!)
  }
}

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  
  let shouldRunOCR = ProcessInfo.processInfo.environment["RUN_OCR"] == "true"
  let shouldRunAppWindow = ProcessInfo.processInfo.environment["RUN_APP_WINDOW"] == "true"
  let shouldRunTest = ProcessInfo.processInfo.environment["TEST_RUN"] == "true"
  let shouldShowTray = ProcessInfo.processInfo.environment["SHOW_TRAY"] == "true"
  let isVirtualApp = ProcessInfo.processInfo.environment["PREVENT_FOCUSING"] == "true"

  let queue = AsyncGroup()
  var socketBridge: SocketBridge!
  var windo: Windo!
  var screen: Screen!
  var curPosition = NSRect()
  private var lastSent = ""
  private var supportsTransparency = false
  private var accessibilityPermission = false
  private var trayLocation = "Out"
  private var lastTrayBoundsMessage = ""

  let statusItem = NSStatusBar.system.statusItem(withLength:NSStatusItem.variableLength)

  lazy var window = NSWindow(
    contentRect: NSMakeRect(1413, 0, 500, 900),
    styleMask: [],
    backing: .buffered,
    defer: false,
    screen: nil
  )
  var blurryView = NSVisualEffectView(frame: NSMakeRect(0, 0, 500, 900))

  private func emit(_ msg: String) {
    self.socketBridge.send(msg)
  }
  
  private func _maskImage(cornerRadius: CGFloat) -> NSImage {
    let edgeLength = 2.0 * cornerRadius + 1.0
    let maskImage = NSImage(size: NSSize(width: edgeLength, height: edgeLength), flipped: false) { rect in
      let bezierPath = NSBezierPath(roundedRect: rect, xRadius: cornerRadius, yRadius: cornerRadius)
      NSColor.black.set()
      bezierPath.fill()
      return true
    }
    maskImage.capInsets = NSEdgeInsets(top: cornerRadius, left: cornerRadius, bottom: cornerRadius, right: cornerRadius)
    maskImage.resizingMode = .stretch
    return maskImage
  }
  
  func applicationWillBecomeActive(_ notification: Notification) {
    self.emit("{ \"action\": \"appState\", \"value\": \"focus\" }")
    if isVirtualApp {
      // hide it immediately, we never want to "really" focus this window we just move to Orbit
      NSApp.hide(nil)
    }
  }
  
  func applicationWillResignActive(_ notification: Notification) {
    self.emit("{ \"action\": \"appState\", \"value\": \"blur\" }")
  }
  
  func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
    self.emit("{ \"action\": \"appState\", \"value\": \"exit\" }")
    return NSApplication.TerminateReply.terminateNow
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    socketBridge = SocketBridge(queue: self.queue, onMessage: self.onMessage)
    print("did finish launching, ocr: \(shouldRunOCR), port: \(ProcessInfo.processInfo.environment["SOCKET_PORT"] ?? "")")
    
    if #available(OSX 10.11, *) {
      self.supportsTransparency = true
    }

    if shouldRunOCR {
      windo = Windo(emit: self.emit)

      // testing trust:
//      let checkOptPrompt = kAXTrustedCheckOptionPrompt.takeUnretainedValue() as NSString
//      let options = [checkOptPrompt: true]
//      let accessEnabled = AXIsProcessTrustedWithOptions(options as CFDictionary?)
//      print("trust \(accessEnabled)")
     
      do {
        screen = try Screen(emit: self.emit, queue: self.queue, displayId: CGMainDisplayID())
      } catch let error as NSError {
        print("Error \(error.domain)")
        print(Thread.callStackSymbols)
      }
      screen.onStart = {
        print("screen started")
      }
      screen.onFinish = {
        exit(0)
      }
      screen.onError = {
        print(Thread.callStackSymbols)
        printErr($0)
        exit(1)
      }
      if shouldRunTest {
        print("running in test mode...")
        screen.watchBounds(
          fps: 10,
          boxes: [
            Box(id: 1, x: 0, y: 23, width: 850, height: 1200, screenDir: "/tmp/screen", findContent: true, initialScreenshot: true, ocr: true)
          ],
          showCursor: true,
          videoCodec: "mp4",
          sampleSpacing: 10,
          sensitivity: 2,
          debug: true
        )
        screen.start()
      }
    }
    
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

      blurryView.maskImage = _maskImage(cornerRadius: 16.0)
      blurryView.layer?.masksToBounds = true
      blurryView.wantsLayer = true
      blurryView.blendingMode = NSVisualEffectView.BlendingMode.behindWindow
      if #available(OSX 10.11, *) {
        blurryView.material = NSVisualEffectView.Material.dark
      } else {
        // Fallback on earlier versions
      }
      blurryView.state = NSVisualEffectView.State.active
      blurryView.updateLayer()
      window.contentView?.addSubview(blurryView)
      window.makeKeyAndOrderFront(nil)
    }

    if shouldShowTray {
      statusItem.highlightMode = false
      if let button = statusItem.button {
        button.image = NSImage(named:NSImage.Name("tray"))
        button.action = #selector(self.handleTrayClick(_:))

        // setup hover events
        let throttleHoverQueue = DispatchQueue.global(qos: .background)
        let throttledHover =  throttle(delay: 0.03, queue: throttleHoverQueue, action: self.handleTrayHover)
        var lastTrayRect = [0, 0]
        let rectInWindow = button.convert(button.bounds, to: nil)
        let trayRect = (button.window?.convertToScreen(rectInWindow))!
        
        NSEvent.addGlobalMonitorForEvents(matching: [.mouseMoved]) { (event) in
          let height = (NSScreen.main?.frame.height)!
          let mouseLocation = (event.cgEvent?.location)!
          let invMouseLocation = NSPoint.init(x: mouseLocation.x, y: height - mouseLocation.y)
          
          self.emit("{ \"action\": \"mousePosition\", \"value\": [\(round(mouseLocation.x)), \(round(mouseLocation.y))] }")
          
          let nextTrayRect = [Int(round(trayRect.minX)), Int(round(trayRect.maxX))]
          // send tray location...
          if (nextTrayRect[0] != lastTrayRect[0] || nextTrayRect[1] != lastTrayRect[1]) {
            lastTrayRect = nextTrayRect
            print("sending new tray rect \(nextTrayRect)")
            self.lastTrayBoundsMessage = "{ \"action\": \"appState\", \"value\": { \"trayBounds\": [\(nextTrayRect[0]), \(nextTrayRect[1])] } }"
            self.emit(self.lastTrayBoundsMessage)
          }
          // handle events
          self.trayLocation = self.getTrayLocation(mouseLocation: invMouseLocation, trayRect: trayRect)
          throttledHover((self.trayLocation, self.socketBridge))
        }
      }
    }
    
    print("finished running app window")
  }
  
  @objc func handleTrayClick(_ sender: Any?) {
    if self.trayLocation != "Out" {
      self.emit("{ \"action\": \"appState\", \"value\": \"TrayToggle\(trayLocation)\" }")
    }
  }
  
  var lastHoverEvent = ""
  
  func handleTrayHover(trayLocation: String, socketBridge: SocketBridge) {
    // avoid sending more than one out event
    if (lastHoverEvent == trayLocation) {
      return
    }
    lastHoverEvent = trayLocation
    print("hover \(trayLocation)")
    socketBridge.send("{ \"action\": \"appState\", \"value\": \"TrayHover\(trayLocation)\" }")
  }
  
  func getTrayLocation(mouseLocation: NSPoint, trayRect: NSRect) -> String {
    let mouseX = mouseLocation.x
    let mouseY = mouseLocation.y
    let trayButtonMaxX = [40, 65, 95, 125]
    let withinX = mouseX >= trayRect.minX && mouseX <= trayRect.maxX
    let withinY = mouseY >= trayRect.minY && mouseY <= trayRect.maxY
    if (withinX && withinY) {
      let xOff = Int(trayRect.maxX - mouseX)
//      print("xoff \(xOff)")
      if (xOff < trayButtonMaxX[0]) {
        return "Orbit"
      }
      else if (xOff < trayButtonMaxX[1]) {
        return "2"
      }
      else if (xOff < trayButtonMaxX[2]) {
        return "1"
      }
      else {
        return "0"
      }
    }
    return "Out"
  }

  func showWindow() {
    window.alphaValue = 1
  }
  
  func hideWindow() {
    window.alphaValue = 0
  }
  
  func position(_ position: Position) {
    let screen = NSScreen.main!
    let rect = screen.frame
    let height = rect.size.height
    let x = CGFloat(position.x)
    let y = CGFloat(position.y)
    let w = CGFloat(position.width)
    let h = CGFloat(position.height)
    let nextRect = NSMakeRect(x, height - h - y, w, h)
    self.window.setFrame(nextRect, display: true, animate: false)
    self.blurryView.setFrameSize(NSMakeSize(w, h))
  }
  
  func theme(_ themeOpt: String) {
    var theme = themeOpt
    if theme == "auto" {
      theme = InterfaceStyle() == InterfaceStyle.Dark ? "ultra" : "light"
    }
    if #available(OSX 10.11, *) {
      if theme == "ultra" {
        blurryView.material = NSVisualEffectView.Material.ultraDark
      }
      if theme == "dark" {
        blurryView.material = NSVisualEffectView.Material.dark
      }
      if theme == "light" {
        blurryView.material = NSVisualEffectView.Material.light
      }
      if theme == "hud" {
        if #available(OSX 10.14, *) {
          blurryView.material = NSVisualEffectView.Material.hudWindow
        }
      }
      if theme == "medium" {
        blurryView.material = NSVisualEffectView.Material.mediumLight
      }
      if theme == "popover" {
        blurryView.material = NSVisualEffectView.Material.popover
      }
      if theme == "appearanceBased" {
        blurryView.material = NSVisualEffectView.Material.appearanceBased
      }
      if #available(OSX 10.14, *) {
        if theme == "contentBackground" {
          blurryView.material = NSVisualEffectView.Material.contentBackground
        }
        if theme == "appearanceBased" {
          blurryView.material = NSVisualEffectView.Material.appearanceBased
        }
        if theme == "sheet" {
          blurryView.material = NSVisualEffectView.Material.sheet
        }
        if theme == "underPageBackground" {
          blurryView.material = NSVisualEffectView.Material.underPageBackground
        }
        if theme == "toolTip" {
          blurryView.material = NSVisualEffectView.Material.toolTip
        }
        if theme == "fullScreenUI" {
          blurryView.material = NSVisualEffectView.Material.fullScreenUI
        }
        if theme == "sidebar" {
          blurryView.material = NSVisualEffectView.Material.sidebar
        }
      }
    } else {
      // Fallback on earlier versions
    }
  }
  
  func setIcon(_ path: String) {
    NSApp.applicationIconImage = NSImage.init(contentsOfFile: path)
  }
  
  func sendOSInfo() {
    let info = """
    {
      \"action\": \"info\",
      \"value\": {
        \"supportsTransparency\": \(self.supportsTransparency),
        \"accessibilityPermission\": \(self.accessibilityPermission)
      }
    }
    """
    print("sending \(info)")
    self.emit(info)
    // send last tray bounds too
    if self.lastTrayBoundsMessage != "" {
      self.emit(self.lastTrayBoundsMessage)
    }
  }
  
  func promptForAccessibility() -> Bool {
    var val = false
    if UIElement.isProcessTrusted(withPrompt: true) {
      val = true
    } else {
      val = false
    }
    print("setting accessiblity \(val)")
    self.accessibilityPermission = val
    self.sendOSInfo()
    return val
  }
  
  func onMessage(_ text: String) {
    // dont print things that poll...
    if text != "space" && text != "osin" {
      print("Swift.onMessage \(text)")
    }
    if text.count < 4 {
      print("weird text")
      return
    }
    let action = text[0...3]
    if action == "show" {
      self.showWindow()
      return
    }
    if action == "hide" {
      self.hideWindow()
      return
    }
    if action == "posi" {
      do {
        let position = try JSONDecoder().decode(Position.self, from: text[5..<text.count].data(using: .utf8)!)
        window.setFrameOrigin(NSPoint.init(x: 0, y: 0))
        self.position(position)
      } catch {
        print("Error parsing arguments \(text)")
      }
      return
    }
    if action == "icon" {
      self.setIcon(text[5..<text.count])
      return
    }
    if action == "them" {
      self.theme(text[5..<text.count])
      return
    }
    if action == "spel" {
      do {
        print("spell")
        let input = try JSONDecoder().decode(Words.self, from: text[5..<text.count].data(using: .utf8)!)
        let words = input.words
        let checker = NSSpellChecker()
        let spellingRange = checker.checkSpelling(of: words, startingAt: 0)
        let guesses = checker.guesses(
          forWordRange: spellingRange,
          in: words,
          language: checker.language(),
          inSpellDocumentWithTag: 0
        )!
        print("step 2")
        let jsonGuesses = try JSONEncoder().encode(guesses)
        let strJsonGuesses = String(data: jsonGuesses, encoding: String.Encoding.utf8)!
        self.emit("{ \"action\": \"spellCheck\", \"value\": { \"id\": \(input.id), \"guesses\": \(strJsonGuesses) } }")
      } catch {
        print("error encoding guesses \(error)")
      }
      return
    }
    if action == "stat" {
      // coming from us, ignore
      return
    }
    // on start
    if action == "osin" {
      self.sendOSInfo()
      return
    }
    if action == "spac" {
      if !self.window.isOnActiveSpace {
        print("moving to active space...")
        self.emit("{ \"action\": \"spaceMove\", \"value\": true }")
      }
      return
    }
    if action == "mvsp" {
      self.window.collectionBehavior = .canJoinAllSpaces
      NSApp.activate(ignoringOtherApps: true)
      self.window.collectionBehavior = .managed
      return
    }
    if action == "appi" {
      let app = NSWorkspace.shared.frontmostApplication!
      let id = app.localizedName!
      self.emit("{ \"action\": \"info\", \"value\": { \"appId\": \"\(id)\" } }")
      return
    }
    if action == "paus" {
      print("pausing screen...")
      screen.pause()
      return
    }
    if action == "resu" {
      print("resuming screen...")
      screen.resume()
      return
    }
    if action == "watc" {
      do {
        print("watching \(text[5..<text.count])")
        let options = try JSONDecoder().decode(Options.self, from: text[5..<text.count].data(using: .utf8)!)
        screen.watchBounds(
          fps: options.fps,
          boxes: options.boxes,
          showCursor: options.showCursor,
          videoCodec: options.videoCodec,
          sampleSpacing: options.sampleSpacing,
          sensitivity: options.sensitivity,
          debug: options.debug
        )
      } catch {
        print("Error parsing arguments \(text)")
      }
      return
    }
    if action == "star" {
      print("start screen...")
      if (self.promptForAccessibility()) {
        screen.start()
      }
      return
    }
    if action == "clea" {
      screen.clear()
      return
    }
    if action == "defo" {
      windo.defocus()
      return
    }
    // request accessibility
    if action == "reac" {
      _ = self.promptForAccessibility()
      return
    }
    // start window watching
    if action == "staw" {
      if self.promptForAccessibility() {
        windo.start()
      }
      return
    }
    // stop window watching
    if action == "stow" {
      windo.stop()
      return
    }
    print("received unknown message: \(text)")
  }

  func applicationWillTerminate(_ aNotification: Notification) {
    print("telling recorder to stop...")
    if shouldRunOCR {
      screen.stop()
    }
    print("recorder stopped, exiting...")
  }
}

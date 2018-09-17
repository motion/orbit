import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import PromiseKit
import Darwin

let shouldRunOCR = ProcessInfo.processInfo.environment["RUN_OCR"] == "true"
let shouldRunTest = ProcessInfo.processInfo.environment["TEST_RUN"] == "true"
let isVirtualApp = ProcessInfo.processInfo.environment["PREVENT_FOCUSING"] == "true"

struct Position: Decodable {
  let x: Int
  let y: Int
  let width: Int
  let height: Int
}

class BlurryEffectView: NSVisualEffectView {
  override func updateLayer() {
    super.updateLayer()
    
    let backdrop = self.layer!.sublayers!.first!
    
    if backdrop.sublayers != nil {
      for sublayer in backdrop.sublayers! {
        print("123 \(String(describing: sublayer.name))")
        if sublayer.name == "Backdrop" {
          for filter in sublayer.filters! {
            print("------------------- \(type(of: filter))")
            //          let f = filter as [Filter]
            //          if filter.respondsToSelector("name") {
            //            if filter.name == "Backdrop" {
            //
            //            }
            //          }
          }
        }
      }
    }
  }
}

enum InterfaceStyle : String {
  case Dark, Light
  init() {
    let type = UserDefaults.standard.string(forKey: "AppleInterfaceStyle") ?? "Light"
    self = InterfaceStyle(rawValue: type)!
  }
}

class AppDelegate: NSObject, NSApplicationDelegate {
  let queue = AsyncGroup()
  var socketBridge: SocketBridge!
  var windo: Windo!
  var screen: Screen!
  var curPosition = NSRect()
  private var lastSent = ""
  private var supportsTransparency = false

  lazy var window = NSWindow(
    contentRect: NSMakeRect(1413, 0, 500, 900),
    styleMask: [],
    backing: .buffered,
    defer: false,
    screen: nil
  )
  var blurryView = BlurryEffectView(frame: NSMakeRect(0, 0, 500, 900))

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

    if shouldRunOCR == true {
//      windo = Windo(emit: self.emit)
      do {
        screen = try Screen(emit: self.emit, queue: self.queue, displayId: CGMainDisplayID())
        screen.start()
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
    } else {
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
      
      if #available(OSX 10.11, *) {
        self.supportsTransparency = true
      }
      
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
    } else {
      // Fallback on earlier versions
    }
  }
  
  func setIcon(_ path: String) {
    NSApp.applicationIconImage = NSImage.init(contentsOfFile: path)
  }
  
  func onMessage(_ text: String) {
//    print("Swift.onMessage \(text)")
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
    if action == "stat" {
      // coming from us, ignore
      return
    }
    // on start
    if action == "osin" {
      self.emit("{ \"action\": \"info\", \"value\": { \"supportsTransparency\": \(self.supportsTransparency) } }")
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
      screen.pause()
      return
    }
    if action == "resu" {
      screen.resume()
      return
    }
    if action == "star" {
      screen.start()
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
    if action == "clea" {
      screen.clear()
      return
    }
    if action == "defo" {
      windo.defocus()
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


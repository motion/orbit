import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import Swindler
import PromiseKit
import Darwin

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  let shouldRunTest = ProcessInfo.processInfo.environment["TEST_RUN"] == "true"
  var swindler: Swindler.State!
  var observer: Observer!
  var recorder: Recorder!
  private var lastSent = ""
  //    @IBOutlet weak var window: NSWindow!

  private func emit(_ str: String) {
    
  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    if !AXSwift.checkIsProcessTrusted(prompt: true) {
      emit("Not trusted as an AX process; please authorize and re-launch")
      NSApp.terminate(self)
    }

    do {
      recorder = try Recorder(
        displayId: CGMainDisplayID() // : CGDirectDisplayID(options.displayId)!
      )
    } catch let error as NSError {
      print("Error \(error.domain)")
      print(Thread.callStackSymbols)
    }
    
    if shouldRunTest {
      print("running in test mode...")
      recorder.watchBounds(
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
      recorder.start()
    }

    recorder.onStart = {
      print("R")
    }
    
    recorder.onFinish = {
      exit(0)
    }
    
    recorder.onError = {
      print(Thread.callStackSymbols)
      printErr($0)
      exit(1)
    }

    
    var lastScroll = DispatchTime.now()
    NSEvent.addGlobalMonitorForEvents(matching: NSEvent.EventTypeMask.scrollWheel, handler: { event in
      let msSinceLast = Int(Double(DispatchTime.now().uptimeNanoseconds - lastScroll.uptimeNanoseconds) / 1_000_000)
      if msSinceLast > 200 {
        self.emit(":ScrollEvent \(DispatchTime.now().rawValue)")
        lastScroll = DispatchTime.now()
      }
    })
    
    //        NSEvent.addGlobalMonitorForEvents(matching: NSEvent.EventTypeMask.any, handler: { event in
    //            self.emit("got event \(event)")
    //        })
    
    emit("loaded swindler")
    sleep(1)
    
    swindler = Swindler.state
    swindler.on { (event: WindowCreatedEvent) in
      let window = event.window
      self.emit(":WindowCreatedEvent \(window.title.value)")
    }
    swindler.on { (event: WindowPosChangedEvent) in
      self.emit(":WindowPosChangedEvent \(event.newValue)")
    }
    swindler.on { (event: WindowSizeChangedEvent) in
      self.emit(":WindowSizeChangedEvent \(event.newValue)")
    }
    swindler.on { (event: WindowDestroyedEvent) in
      self.emit(":WindowDestroyedEvent \(event.window.title.value)")
    }
    swindler.on { (event: ApplicationMainWindowChangedEvent) in
      self.frontmostWindowChanged()
    }
    swindler.on { (event: FrontmostApplicationChangedEvent) in
      if event.newValue == nil { return }
      self.frontmostWindowChanged()
    }
    swindler.on { (event: WindowTitleChangedEvent) in
      self.frontmostWindowChanged()
    }
    
    // send current app immediately
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
      self.frontmostWindowChanged()
    }
  }
  
  private func frontmostWindowChanged() {
    let app = swindler.frontmostApplication.value!
    let frontWindow = app.mainWindow.value
    if (frontWindow == nil) { return }
    let window = frontWindow!
    let title = String(window.title.value).replacingOccurrences(of: "\"", with: "")
    let titleString = "\"\(title)\"";
    let offset = window.position.value
    let bounds = window.size.value
    let id = app.bundleIdentifier
    self.emit(":FrontmostWindowChangedEvent { \"id\": \"\(id ?? "")\", \"title\": \(titleString), \"offset\": [\(offset.x),\(offset.y)], \"bounds\": [\(bounds.width),\(bounds.height)] }")
  }
  
  func applicationWillTerminate(_ aNotification: Notification) {
    print("telling recorder to stop...")
    recorder.stop()
    print("recorder stopped, exiting...")
  }
  
}


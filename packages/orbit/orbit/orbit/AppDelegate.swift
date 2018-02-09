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
  var watcher: Windo!
  var recorder: Recorder!
  private var lastSent = ""
  @IBOutlet weak var window: NSWindow!
  
  private func emit(_ msg: String) {
    print("emitting... \(msg)")
  }
  
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    if !AXSwift.checkIsProcessTrusted(prompt: true) {
      print("Not trusted as an AX process; please authorize and re-launch")
      NSApp.terminate(self)
    }
    
    watcher = Windo(emit: self.emit)

    do {
      recorder = try Recorder(displayId: CGMainDisplayID())
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
      print("screen started")
    }
    recorder.onFinish = {
      exit(0)
    }
    recorder.onError = {
      print(Thread.callStackSymbols)
      printErr($0)
      exit(1)
    }
  }

  func applicationWillTerminate(_ aNotification: Notification) {
    print("telling recorder to stop...")
    recorder.stop()
    print("recorder stopped, exiting...")
  }
  
}


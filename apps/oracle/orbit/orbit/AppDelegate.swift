import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import PromiseKit
import Darwin
import Async

class AppDelegate: NSObject, NSApplicationDelegate {
  let shouldRunTest = ProcessInfo.processInfo.environment["TEST_RUN"] == "true"
  let queue = AsyncGroup()
  var socketBridge: SocketBridge!
  var watcher: Windo!
  var screen: Screen!
  private var lastSent = ""
  @IBOutlet weak var window: NSWindow!
  
  private func emit(_ msg: String) {
    self.socketBridge.send(msg)
  }

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    socketBridge = SocketBridge(queue: self.queue, onMessage: self.onMessage)
    watcher = Windo(emit: self.emit)

    do {
      screen = try Screen(emit: self.emit, queue: self.queue, displayId: CGMainDisplayID())
    } catch let error as NSError {
      print("Error \(error.domain)")
      print(Thread.callStackSymbols)
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
  }
  
  func onMessage(_ text: String) {
    if text.count < 5 {
      print("weird text")
      return
    }
    let action = text[0...4]
    if action == "state" {
      // coming from us, ignore
      return
    }
    if action == "pause" {
      screen.pause()
      return
    }
    if action == "resum" {
      screen.resume()
      return
    }
    if action == "start" {
      screen.start()
      return
    }
    if action == "watch" {
      do {
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
    if action == "clear" {
      screen.clear()
      return
    }
    print("received unknown message: \(text)")
  }

  func applicationWillTerminate(_ aNotification: Notification) {
    print("telling recorder to stop...")
    screen.stop()
    print("recorder stopped, exiting...")
  }
  
}


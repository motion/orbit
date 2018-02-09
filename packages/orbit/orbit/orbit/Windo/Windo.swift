import AXSwift
import class AXSwift.Application
import class AXSwift.Observer
import Cocoa
import Swindler
import PromiseKit
import Darwin

final class Windo {
  var emit: (String)->Void
  var swindler: Swindler.State!
  var observer: Observer!
  private var lastSent = ""
  @IBOutlet weak var window: NSWindow!

  init(emit: @escaping (String)->Void) {
    self.emit = emit

    var lastScroll = DispatchTime.now()
    NSEvent.addGlobalMonitorForEvents(matching: NSEvent.EventTypeMask.scrollWheel, handler: { event in
      let msSinceLast = Int(Double(DispatchTime.now().uptimeNanoseconds - lastScroll.uptimeNanoseconds) / 1_000_000)
      if msSinceLast > 200 {
        self.emit("{ \"action\": \"ScrollEvent\" }") // \(DispatchTime.now().rawValue)
        lastScroll = DispatchTime.now()
      }
    })

    sleep(1)

    swindler = Swindler.state
    swindler.on { (event: WindowCreatedEvent) in
      let window = event.window
      self.emit("{ \"action\": \"WindowCreatedEvent\", \"value\": \"\(window.title.value)\" }")
    }
    swindler.on { (event: WindowPosChangedEvent) in
      let val = event.newValue
      self.emit("{ \"action\": \"WindowPosChangedEvent\", \"value\": [\(val.x), \(val.y)] }")
    }
    swindler.on { (event: WindowSizeChangedEvent) in
      let val = event.newValue
      self.emit("{ \"action\": \"WindowSizeChangedEvent\", \"value\": [\(val.width), \(val.height)] }")
    }
    swindler.on { (event: WindowDestroyedEvent) in
      self.emit("{ \"action\": \"WindowDestroyedEvent\", \"value\": \"\(event.window.title.value)\" }")
    }
    swindler.on { (event: ApplicationMainWindowChangedEvent) in
      //      self.frontmostWindowChanged()
    }
    swindler.on { (event: FrontmostApplicationChangedEvent) in
      if event.newValue == nil { return }
      //      self.frontmostWindowChanged()
    }
    swindler.on { (event: WindowTitleChangedEvent) in
      //      self.frontmostWindowChanged()
    }

    // send current app immediately
    //    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
    //      self.frontmostWindowChanged()
    //    }
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



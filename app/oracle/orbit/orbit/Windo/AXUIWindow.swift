import Cocoa

protocol AXUIWindow {
  var title : String { get }
  var size  : NSSize { get set }
  var origin: NSPoint{ get set }
  var frame : NSRect { get set }
}

protocol AXUIWindowArray {
  func getAXUIWindows(processIdentifier pid: pid_t)   -> [AXUIWindow]
  func getAXUIWindows(bundleIdentifier bid: String) -> [AXUIWindow]
}

struct AXUIWindowElement : AXUIWindow {
  let element: AXUIElement!
  init(element: AXUIElement) {
    self.element = element
  }
  func copyAttribute<T>(attribute: String, _ handler: (_ memory: AnyObject?) -> T) -> T {
    let val = UnsafeMutablePointer<AnyObject?>.allocate(capacity: 1)
    AXUIElementCopyAttributeValue(element, attribute as CFString, val)
    let ret = handler(val.pointee)
    val.deallocate(capacity: 1)
    return ret
  }
  var title : String {
    return copyAttribute(attribute: NSAccessibilityAttributeName.title.rawValue, { (memory) -> String in
      return memory as? String ?? ""
    })
  }
  var size : NSSize {
    get {
      return copyAttribute(attribute: NSAccessibilityAttributeName.size.rawValue, { (memory) -> NSSize in
        if let mem = memory {
          var val = NSSize()
          AXValueGetValue(mem as! AXValue, AXValueType.cgSize, &val)
          return val
        } else {
          return NSZeroSize
        }
      })
    }
    set {}
  }
  var origin : NSPoint {
    get {
      return copyAttribute(attribute: NSAccessibilityAttributeName.position.rawValue, {(memory) -> NSPoint in
        if let mem = memory {
          var val = NSPoint()
          AXValueGetValue(mem as! AXValue, AXValueType.cgPoint, &val)
          return val
        } else {
          return NSZeroPoint
        }
      })
    }
    set {}
  }
  var frame : NSRect {
    get {
      let org = self.origin, siz = self.size
      return NSMakeRect(org.x, org.y, siz.width, siz.height)
    }
    set {}
  }
}

extension AXUIWindowArray {
  func getAXUIWindows(processIdentifier pid: pid_t) -> [AXUIWindow] {
    let elm = AXUIElementCreateApplication(pid)
    let val = UnsafeMutablePointer<AnyObject?>.allocate(capacity: 1)
    AXUIElementCopyAttributeValue(elm, NSAccessibilityAttributeName.windows as CFString, val)
    let mem = val.pointee as? [AXUIElement] ?? []
    val.deallocate(capacity: 1)
    let ary = mem.map({ AXUIWindowElement(element: $0) }) as [AXUIWindow]
    let run = NSWorkspace.shared.runningApplications
    let fin = run.filter({ $0.bundleIdentifier == "com.apple.finder" }).first
    let con = fin?.processIdentifier == pid
    return con ? ary.filter({ $0.title != "" }) : ary
  }
  func getAXUIWindows(bundleIdentifier bid: String) -> [AXUIWindow] {
    let run = NSWorkspace.shared.runningApplications
    if let app = run.filter({$0.bundleIdentifier == bid}).first {
      return getAXUIWindows(processIdentifier: app.processIdentifier)
    } else {
      return []
    }
  }
}

extension NSRunningApplication: AXUIWindowArray {
  var windows:[AXUIWindow] {
    return getAXUIWindows(processIdentifier: self.processIdentifier)
  }
}


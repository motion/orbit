import Cocoa
import AXSwift

let applicationDelegate = AppDelegate()
let application = NSApplication.shared
//application.setActivationPolicy(NSApplication.ActivationPolicy.accessory)
application.delegate = applicationDelegate
application.run()

import Cocoa
import AXSwift

if !AXSwift.checkIsProcessTrusted(prompt: true) {
  print("Not trusted as an AX process; please authorize and re-launch")
  exit(0)
}

let applicationDelegate = AppDelegate()
let application = NSApplication.shared
application.setActivationPolicy(NSApplication.ActivationPolicy.accessory)
application.delegate = applicationDelegate
application.run()


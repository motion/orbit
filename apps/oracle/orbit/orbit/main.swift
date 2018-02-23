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

// super hack: node doesnt see the stdout for who knows what reason
// so we re-route everything to stderr with a ! in front
// cringe alert

func print(_ items: Any..., separator: String = " ", terminator: String = "\n") {
//  Swift.print(items[0], separator:separator, terminator: terminator)
  fputs("!\(items.map { "\($0)" }.joined(separator: separator))", __stderrp)
}

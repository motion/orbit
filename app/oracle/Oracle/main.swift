import Cocoa

let appDelegate = AtomApplication()
NSApplication.shared.delegate = appDelegate

let mainNibFileBaseName = Bundle.main.infoDictionary!["NSMainNibFile"] as! String
Bundle.main.loadNibNamed(mainNibFileBaseName, owner: NSApplication.shared, topLevelObjects: nil)

NSApp.setActivationPolicy(.accessory)
NSApplication.shared.run()

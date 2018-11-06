import Cocoa
let myApp: NSApplication = NSApplication.shared
let myDelegate: AtomApplication = AtomApplication()
myApp.delegate = myDelegate
let mainBundle: Bundle = Bundle.main
let mainNibFileBaseName: String = mainBundle.infoDictionary!["NSMainNibFile"] as! String
mainBundle.loadNibNamed(mainNibFileBaseName, owner: myApp, topLevelObjects: nil)
_ = NSApplicationMain(CommandLine.argc, CommandLine.unsafeArgv)

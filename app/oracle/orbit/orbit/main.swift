import Cocoa
import AXSwift

let applicationDelegate = AppDelegate()
let application = NSApplication.shared
application.delegate = applicationDelegate
_ = NSApplicationMain(CommandLine.argc, CommandLine.unsafeArgv)

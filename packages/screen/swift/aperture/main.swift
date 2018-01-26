import Foundation
import AVFoundation

var recorder: Recorder!
let arguments = CommandLine.arguments.dropFirst()

func quit(_: Int32) {
  recorder.stop()
  print("received quit, quitting...")
  exit(0)
}

// sensitivity = how many pixels need to change before it triggers
//    you want this lower because allows loop to break sooner
// sampleSpacing = dithering basically, how many pixels to skip before checking the next
//    you want this higher, because it makes the loops shorter
struct Options: Decodable {
  let fps: Int
  let boxes: Array<Box>
  let showCursor: Bool
  let displayId: String
  let videoCodec: String?
  let sampleSpacing: Int
  let sensitivity: Int
  let debug: Bool
}

func record() throws {
  var options: Options

  recorder = try Recorder(
    displayId: CGMainDisplayID() // : CGDirectDisplayID(options.displayId)!
  )
  
  if arguments.first != nil {
    options = try JSONDecoder().decode(Options.self, from: arguments.first!.data(using: .utf8)!)
    try recorder.watchBounds(
      fps: options.fps,
      boxes: options.boxes,
      showCursor: options.showCursor,
      videoCodec: options.videoCodec,
      sampleSpacing: options.sampleSpacing,
      sensitivity: options.sensitivity,
      debug: options.debug
    )
    recorder.start()
  }

  recorder.onStart = {
    print("R")
  }

  recorder.onFinish = {
    exit(0)
  }

  recorder.onError = {
    printErr($0)
    exit(1)
  }

  signal(SIGHUP, quit)
  signal(SIGINT, quit)
  signal(SIGTERM, quit)
  signal(SIGQUIT, quit)

  setbuf(__stdoutp, nil)

  RunLoop.main.run()
}

try record()
exit(1)




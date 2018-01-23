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
}

func record() throws {
  // for release
  let json = arguments.first!.data(using: .utf8)!
  let options = try JSONDecoder().decode(Options.self, from: json)
  // for testing
//  let options = Options(
//    fps: 10,
//    boxes: [
//      Box(id: "screen", x: 0, y: 24, width: 1166, height: 980, screenDir: "/tmp/screen", findContent: true, initialScreenshot: true)
//    ],
//    showCursor: true,
//    displayId: "main",
//    videoCodec: "mp4",
//    sampleSpacing: 10,
//    sensitivity: 2
//  )
  
  recorder = try Recorder(
    fps: options.fps,
    boxes: options.boxes,
    showCursor: options.showCursor,
    displayId: options.displayId == "main" ? CGMainDisplayID() : CGDirectDisplayID(options.displayId)!,
    videoCodec: options.videoCodec,
    sampleSpacing: options.sampleSpacing,
    sensitivity: options.sensitivity
  )

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

  recorder.start()
  setbuf(__stdoutp, nil)

  RunLoop.main.run()
}

func usage() {
  print(
    """
    Usage:
      aperture <options>
      aperture list-audio-devices
    """
  )
}

if arguments.first != nil {
  try record()
  exit(0)
}

try record()
//usage()
exit(1)


import Foundation
import AVFoundation

var recorder: Recorder!
let arguments = CommandLine.arguments.dropFirst()

func quit(_: Int32) {
  recorder.stop()
  exit(0)
}

struct Options: Decodable {
  let destination: URL
  let fps: Int
  let boxes: Array<Box>
  let showCursor: Bool
  let displayId: String
  let videoCodec: String?
  let sampleSpacing: Int
  let sensitivity: Int
}

func record() throws {
//  let json = arguments.first!.data(using: .utf8)!
//  let options = try JSONDecoder().decode(Options.self, from: json)
  // for testing
  let options = Options(
    destination: URL(fileURLWithPath: "/tmp/test.png"),
    fps: 10,
    boxes: [Box(id: 0, x: 0, y: 0, width: 100, height: 50)],
    showCursor: true,
    displayId: "main",
    videoCodec: "mp4",
    sampleSpacing: 10,
    sensitivity: 1
  )
  
  recorder = try Recorder(
    destination: options.destination,
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

print("hi")
try record()
//usage()
exit(1)


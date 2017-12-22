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
  let cropRect: CGRect?
  let showCursor: Bool
  let displayId: String
  let videoCodec: String?
}

func record() throws {
  let json = arguments.first!.data(using: .utf8)!
  let options = try JSONDecoder().decode(Options.self, from: json)
  // for testing
//  let options = Options(
//    fps: 10,
//    cropRect: CGRect(x: 100, y: 100, width: 500, height: 500),
//    showCursor: true,
//    displayId: "main",
//    videoCodec: "mp4"
//  )

  recorder = try Recorder(
    destination: options.destination,
    fps: options.fps,
    cropRect: options.cropRect,
    showCursor: options.showCursor,
    displayId: options.displayId == "main" ? CGMainDisplayID() : CGDirectDisplayID(options.displayId)!,
    videoCodec: options.videoCodec
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

if arguments.first == "list-audio-devices" {
  // Uses stderr because of unrelated stuff being outputted on stdout
  printErr(try toJson(DeviceList.audio()))
  exit(0)
}

if arguments.first != nil {
  try record()
  exit(0)
}

//try record()
usage()
exit(1)


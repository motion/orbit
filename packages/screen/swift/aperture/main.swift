import Foundation
import AVFoundation

var recorder: Recorder!
let arguments = CommandLine.arguments.dropFirst()

func quit(_: Int32) {
  print("telling recorder to stop...")
  recorder.stop()
  print("recorder stopped, exiting...")
  exit(0)
}

// test dictionary stuff
//let dict = SymSpell(editDistance: 2, verbose: 2)
//dict.createDictionaryEntry("reallylongthingslong", language: "en")
//dict.createDictionaryEntry("hi", language: "en")
//dict.createDictionaryEntry("hii", language: "en")
//dict.createDictionaryEntry("hiii", language: "en")
//dict.createDictionaryEntry("hooo", language: "en")
//dict.createDictionaryEntry("hell", language: "en")
//let ans = dict.correct("reallylongthingslo", language: "en")
//print("\(ans.map { "\($0.term)\($0.distance)" })")
//exit(0)

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
  do {
    recorder = try Recorder(
      displayId: CGMainDisplayID() // : CGDirectDisplayID(options.displayId)!
    )
  } catch let error as NSError {
    print("Error \(error.domain)")
    print(Thread.callStackSymbols)
  }

  if arguments.first == "--test" {
    print("running in test mode...")
    recorder.watchBounds(
      fps: 10,
      boxes: [
        Box(id: 1, x: 0, y: 23, width: 543, height: 928, screenDir: "/tmp/screen", findContent: true, initialScreenshot: true)
      ],
      showCursor: true,
      videoCodec: "mp4",
      sampleSpacing: 10,
      sensitivity: 2,
      debug: true
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
    print(Thread.callStackSymbols)
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




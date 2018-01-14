const os = require('os')
const path = require('path')
const execa = require('execa')
const macosVersion = require('macos-version')
const electronUtil = require('electron-util/node')

// Workaround for https://github.com/electron/electron/issues/9459
const BIN = path.join(electronUtil.fixPathForAsarUnpack(__dirname), 'aperture')
const sleep = ms => new Promise(res => setTimeout(res, ms))

const supportsHevcHardwareEncoding = (() => {
  if (!macosVersion.isGreaterThanOrEqualTo('10.13')) {
    return false
  }
  // Get the Intel Core generation, the `4` in `Intel(R) Core(TM) i7-4850HQ CPU @ 2.30GHz`
  // More info: https://www.intel.com/content/www/us/en/processors/processor-numbers.html
  const result = /Intel.*Core.*i(?:7|5)-(\d)/.exec(os.cpus()[0].model)
  // Intel Core generation 6 or higher supports HEVC hardware encoding
  return result && Number(result[1]) >= 6
})()

class Screen {
  constructor() {
    this.changedFrameCb = null
    macosVersion.assertGreaterThanOrEqualTo('10.12')

    // handle exits to ensure killing swift sub-process
    // const stopRecording = () => this.stopRecording()
    // process.on('exit', stopRecording)
    // process.on('SIGINT', stopRecording)
    // process.on('SIGUSR1', stopRecording)
    // process.on('SIGUSR2', stopRecording)
  }

  startRecording(
    {
      fps = 25,
      showCursor = true,
      displayId = 'main',
      audioDeviceId = undefined,
      videoCodec = undefined,
      // how far between pixels to check
      sampleSpacing = 10,
      // how many pixels to detect before triggering change
      sensitivity = 2,
      boxes,
      initialScreenshot = false,
    } = {},
  ) {
    if (this.recorder !== undefined) {
      throw new Error('Call `.stopRecording()` first')
    }

    const recorderOpts = {
      fps,
      showCursor,
      initialScreenshot,
      displayId,
      audioDeviceId,
      sampleSpacing,
      sensitivity,
      boxes,
    }

    if (videoCodec) {
      const codecMap = new Map([
        ['h264', 'avc1'],
        ['hevc', 'hvc1'],
        ['proRes422', 'apcn'],
        ['proRes4444', 'ap4h'],
      ])

      if (!supportsHevcHardwareEncoding) {
        codecMap.delete('hevc')
      }

      if (!codecMap.has(videoCodec)) {
        throw new Error(`Unsupported video codec specified: ${videoCodec}`)
      }

      recorderOpts.videoCodec = codecMap.get(videoCodec)
    }

    const args = JSON.stringify(recorderOpts)

    this.recorder = execa(BIN, [args], {
      reject: false,
    })

    this.recorder.catch((err, ...rest) => {
      console.log('screen err:', ...rest)
      console.log(err)
      console.log(err.stack)
      throw err
    })

    this.recorder.stderr.setEncoding('utf8')
    this.recorder.stderr.on('data', data => {
      console.log('screen stderr:', data)
    })

    this.recorder.stdout.setEncoding('utf8')

    let contentArea
    this.recorder.stdout.on('data', data => {
      if (this.changedFrameCb) {
        const out = data.trim()
        if (out[0] === '!') {
          contentArea = JSON.parse(out.slice(1))
        } else if (out[0] === '>') {
          this.changedFrameCb({
            id: out.slice(1),
            contentArea,
          })
        } else {
          console.log(out)
        }
      }
    })

    return this.recorder
  }

  onChangedFrame(cb) {
    this.changedFrameCb = cb
  }

  async stopRecording() {
    if (this.recorder === undefined) {
      // null if not recording
      return
    }
    this.recorder.stdout.removeAllListeners()
    this.recorder.stderr.removeAllListeners()
    this.recorder.kill()
    this.recorder.kill('SIGKILL')
    await this.recorder
    // sleep to avoid issues
    await sleep(80)
    delete this.recorder
  }
}

module.exports = Screen

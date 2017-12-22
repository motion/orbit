const os = require('os')
const path = require('path')
const execa = require('execa')
const macosVersion = require('macos-version')
const fileUrl = require('file-url')
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
  }

  async startRecording(
    {
      destination = undefined,
      fps = 25,
      cropArea = undefined,
      showCursor = true,
      displayId = 'main',
      audioDeviceId = undefined,
      videoCodec = undefined,
      // how far between pixels to check
      sampleSpacing = 10,
      // how many pixels to detect before triggering change
      sensitivity = 2,
    } = {},
  ) {
    if (this.recorder !== undefined) {
      throw new Error('Call `.stopRecording()` first')
    }

    if (typeof cropArea === 'object') {
      if (
        typeof cropArea.x !== 'number' ||
        typeof cropArea.y !== 'number' ||
        typeof cropArea.width !== 'number' ||
        typeof cropArea.height !== 'number'
      ) {
        throw new Error('Invalid `cropArea` option object')
      }
    }

    const finalDestination = fileUrl(destination)

    const recorderOpts = {
      destination: finalDestination,
      fps,
      showCursor,
      displayId,
      audioDeviceId,
      sampleSpacing,
      sensitivity,
    }

    if (cropArea) {
      recorderOpts.cropRect = [
        [cropArea.x, cropArea.y],
        [cropArea.width, cropArea.height],
      ]
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
    this.recorder = execa(BIN, [args])

    this.recorder.catch((err, ...rest) => {
      console.log('errrr', ...rest)
      console.log(err)
      console.log(err.stack)
    })

    this.recorder.stdout.setEncoding('utf8')
    this.recorder.stdout.on('data', () => {
      if (this.changedFrameCb) {
        this.changedFrameCb()
      }
    })
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
    this.recorder.kill()
    await this.recorder
    // sleep to avoid issues
    await sleep(80)
    delete this.recorder
  }
}

module.exports = Screen

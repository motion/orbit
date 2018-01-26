const os = require('os')
const path = require('path')
const execa = require('execa')
const macosVersion = require('macos-version')
const electronUtil = require('electron-util/node')
const { Server } = require('ws')

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
    console.log('creating screen')
    this.awaitingSocket = []
    this.activeSocket = null
    this.wss = new Server({ port: 40512 })
    this.onLinesCB = _ => _
    this.onWordsCB = _ => _
    this.onClearWordCB = _ => _
    macosVersion.assertGreaterThanOrEqualTo('10.12')

    // handle socket between swift
    this.wss.on('connection', socket => {
      // add to active sockets
      this.activeSocket = socket
      // send queued messages
      if (this.awaitingSocket.length) {
        this.awaitingSocket.forEach(data => this.socketSend(data))
        this.awaitingSocket = []
      }
      // listen for incoming
      socket.on('message', x => this.handleSocketMessage(x))
      // handle events
      socket.on('close', () => {
        this.removeSocket()
      })
      socket.on('error', err => {
        if (err.code !== 'ECONNRESET') {
          throw err
        }
        this.removeSocket()
      })
    })
    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }

  handleSocketMessage(str) {
    const { action, value } = JSON.parse(str)
    try {
      // clear is fast
      if (action === 'clearWord') {
        this.onClearWordCB(value)
      }
      if (action === 'words') {
        this.onWordsCB(value)
      }
      if (action === 'lines') {
        this.onLinesCB(value)
      }
    } catch (err) {
      console.log('error sending reply', action, 'value', value)
      console.log(err)
    }
  }

  start({ debug = false } = {}) {
    if (this.recorder !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    const BIN = path.join(
      electronUtil.fixPathForAsarUnpack(__dirname),
      'swift',
      'Build',
      'Products',
      debug ? 'Debug' : 'Release',
      'aperture',
    )
    this.recorder = execa(BIN, [], {
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
    this.recorder.stdout.on('data', data => {
      const out = data.trim()
      console.log(out)
    })

    return this.recorder
  }

  watchBounds(
    {
      debug = false,
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
    } = {},
  ) {
    // default box options
    const finalBoxes = boxes.map(box => ({
      initialScreenshot: false,
      findContent: false,
      screenDir: null,
      ...box,
    }))

    const recorderOpts = {
      debug,
      fps,
      showCursor,
      displayId,
      audioDeviceId,
      sampleSpacing,
      sensitivity,
      boxes: finalBoxes,
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
      console.log('recorderOpts.videoCodec', recorderOpts.videoCodec)
    }

    this.socketSend({
      start: recorderOpts,
    })
  }

  pause() {
    this.socketSend({ pause: true })
  }

  onClearWord(cb) {
    this.onClearWordCB = cb
  }

  onWords(cb) {
    this.onWordsCB = cb
  }

  onLines(cb) {
    this.onLinesCB = cb
  }

  async stop() {
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

  socketSend(data) {
    if (!this.activeSocket) {
      this.awaitingSocket.push(data)
      return
    }
    const strData = JSON.stringify(data)
    try {
      this.activeSocket.send(strData)
    } catch (err) {
      console.log('failed to send to socket, removing', err, uid)
      this.removeSocket()
    }
  }

  removeSocket() {
    this.activeSocket = null
  }
}

module.exports = Screen

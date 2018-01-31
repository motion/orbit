import path from 'path'
import execa from 'execa'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Server } from 'ws'

export ScreenClient from './client'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default class Screen {
  awaitingSocket = []
  listeners = []
  wss = new Server({ port: 40512 })
  onLinesCB = _ => _
  onWordsCB = _ => _
  onClearWordCB = _ => _
  onErrorCB = _ => _
  onClearCB = _ => _
  state = {
    isPaused: false,
  }

  setState = nextState => {
    this.state = { ...this.state, ...nextState }
    this.socketSend('state', this.state)
  }

  constructor({ debugBuild = false } = {}) {
    this.debugBuild = debugBuild
    macosVersion.assertGreaterThanOrEqualTo('10.12')
    this.setupSocket()
    this.setupRecorder()
  }

  setupRecorder() {
    if (this.recorder !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    const BIN = path.join(
      electronUtil.fixPathForAsarUnpack(__dirname),
      '..',
      this.debugBuild ? 'run-debug' : 'run-release',
    )
    console.log('exec', BIN)
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
      this.onErrorCB(data)
    })
    this.recorder.stdout.setEncoding('utf8')
    this.recorder.stdout.on('data', data => {
      const out = data.trim()
      console.log(out)
    })
  }

  setupSocket() {
    // handle socket between swift
    let id = 0
    this.wss.on('connection', socket => {
      // add to active sockets
      this.listeners.push({ id: id++, socket })
      // send initial state
      this.setState(this.state)
      // send queued messages
      if (this.awaitingSocket.length) {
        this.awaitingSocket.forEach(({ action, data }) =>
          this.socketSend(action, data),
        )
        this.awaitingSocket = []
      }
      // listen for incoming
      socket.on('message', this.handleSocketMessage)
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

  handleSocketMessage = str => {
    // console.log('handleSocketMessage', str)
    const { action, value, state } = JSON.parse(str)
    try {
      // clear is fast
      if (action === 'clearWord') {
        this.onClearWordCB(value)
      }
      // state goes out to clients
      if (state) {
        this.state = state
        this.socketSend('state', this.state)
      }
      if (action === 'words') {
        this.onWordsCB(value)
      }
      if (action === 'lines') {
        this.onLinesCB(value)
      }
      if (action === 'pause') {
        this.pause()
      }
      if (action === 'start') {
        this.start()
      }
      if (action === 'clear') {
        this.onClearCB()
      }
    } catch (err) {
      console.log('error sending reply', action, 'value', value)
      console.log(err)
    }
  }

  start = async () => {
    this.setState({
      isPaused: false,
    })
    if (!this.recorder) {
      this.setupRecorder()
      await sleep(100)
    }
    this.socketSend('start')
  }

  watchBounds = (
    {
      fps = 25,
      showCursor = true,
      displayId = 'main',
      videoCodec = undefined,
      // how far between pixels to check
      sampleSpacing = 10,
      // how many pixels to detect before triggering change
      sensitivity = 2,
      boxes,
      debug = false,
    } = {},
  ) => {
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
      sampleSpacing,
      sensitivity,
      boxes: finalBoxes,
    }

    if (videoCodec) {
      const codecMap = new Map([
        ['h264', 'avc1'],
        ['proRes422', 'apcn'],
        ['proRes4444', 'ap4h'],
      ])

      if (!codecMap.has(videoCodec)) {
        throw new Error(`Unsupported video codec specified: ${videoCodec}`)
      }

      recorderOpts.videoCodec = codecMap.get(videoCodec)
      console.log('recorderOpts.videoCodec', recorderOpts.videoCodec)
    }

    this.socketSend('watch', recorderOpts)
  }

  pause = () => {
    this.setState({ isPaused: true })
    this.socketSend('pause')
  }

  resume = () => {
    this.setState({ isPaused: true })
    this.socketSend('start')
  }

  clear = () => {
    this.socketSend('clear')
  }

  onClear = cb => {
    this.onClearCB = cb
  }

  onClearWord = cb => {
    this.onClearWordCB = cb
  }

  onWords = cb => {
    this.onWordsCB = cb
  }

  onLines = cb => {
    this.onLinesCB = cb
  }

  onError = cb => {
    this.onErrorCB = cb
  }

  stop = async () => {
    if (this.recorder === undefined) {
      // null if not recording
      return
    }
    this.recorder.stdout.removeAllListeners()
    this.recorder.stderr.removeAllListeners()
    setTimeout(() => {
      this.recorder.kill()
      this.recorder.kill('SIGKILL')
    })
    await this.recorder
    delete this.recorder
    // sleep to avoid issues
    await sleep(40)
  }

  socketSend(action, data) {
    if (!this.listeners.length) {
      this.awaitingSocket.push({ action, data })
      return
    }
    // console.log('screen.socketSend', action, data)
    // send format is `action data`
    try {
      const strData =
        typeof data === 'object' ? `${action} ${JSON.stringify(data)}` : action
      for (const { socket, id } of this.listeners) {
        try {
          socket.send(strData)
        } catch (err) {
          console.log('failed to send to socket, removing', err.message, id)
          this.removeSocket(id)
        }
      }
    } catch (err) {
      console.log('screen error parsing socket message', err.message)
    }
  }

  removeSocket = id => {
    this.listeners = this.listeners.filter(s => s.id !== id)
  }
}

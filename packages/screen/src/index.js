import Path from 'path'
import execa from 'execa'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Server } from 'ws'
import promisify from 'sb-promisify'
import pusage_ from 'pidusage'
import killPort from 'kill-port'

const PORT = 40512
const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const buildPath = Path.join(dir, '..', 'swift', 'Build', 'Products')
const RELEASE_PATH = Path.join(buildPath, 'Release')
const DEBUG_PATH = Path.join(buildPath, 'Debug')

const pusage = promisify(pusage_.stat)

export ScreenClient from './client'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default class Screen {
  awaitingSocket = []
  listeners = []
  onLinesCB = _ => _
  onWordsCB = _ => _
  onClearWordCB = _ => _
  onRestoreWordCB = _ => _
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
  }

  start = async () => {
    // kill old apertures
    try {
      await execa('kill', ['-9', 'aperture'])
    } catch (err) {}
    if (!this.wss) {
      // kill old ones
      await killPort(PORT)
      this.wss = new Server({ port: PORT })
      this.setupSocket()
    }
    this.setState({ isPaused: false })
    await this.runScreenProcess()
    await this.connectToScreenProcess()
    this.monitorScreenProcess()
    console.log('Started screen')
  }

  handleSocketMessage = str => {
    const { action, value, state } = JSON.parse(str)
    // console.log('screen.action', action)
    try {
      // clear is fast
      if (action === 'clearWord') {
        this.onClearWordCB(value)
      }
      if (action === 'restoreWord') {
        this.onRestoreWordCB(value)
      }
      // state goes out to clients
      if (state) {
        this.setState(state)
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
      if (action === 'resume') {
        this.resume()
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

  async monitorScreenProcess() {
    // monitor cpu usage
    const maxSecondsSpinning = 10
    let secondsSpinning = 0
    let i = 0
    this.resourceCheckInt = setInterval(async () => {
      if (!this.process) {
        return
      }
      const children = [this.process.pid]
      i++
      for (const pid of children) {
        try {
          const usage = await pusage(pid)
          const memoryMB = Math.round(usage.memory / 1000 / 1000) // start at byte
          if (i % 30 === 0) {
            // every x seconds
            console.log('Current memory usage', memoryMB, 'MB')
          }
          if (memoryMB > 750) {
            console.log('Memory usage of swift above 750MB, restarting')
            this.restart()
          }
          if (usage.cpu > 90) {
            if (secondsSpinning > 5) {
              console.log('High cpu usage for', secondsSpinning, 'seconds')
            }
            secondsSpinning += 1
          } else {
            secondsSpinning = 0
          }
          if (secondsSpinning > maxSecondsSpinning) {
            console.log('CPU usage above 90% for 10 seconds, restarting')
            this.restart()
          }
        } catch (err) {
          console.log('error getting process info, restarting', err.message)
          this.restart()
        }
      }
    }, 1000)
  }

  async restart() {
    clearInterval(this.resourceCheckInt)
    await this.stop()
    await this.start()
  }

  connectToScreenProcess() {
    return new Promise(res => {
      // wait for connection to socket before sending start
      let startWait = setInterval(() => {
        if (this.listeners.length) {
          clearInterval(startWait)
          console.log('sending start')
          this.socketSend('start')
          res()
        }
      }, 10)
    })
  }

  async runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    const binDir = this.debugBuild ? DEBUG_PATH : RELEASE_PATH
    console.log('binDir', binDir)
    this.process = execa('./aperture', [], {
      cwd: binDir,
      reject: false,
    })
    this.process.catch((err, ...rest) => {
      console.log('screen err:', ...rest)
      console.log(err)
      console.log(err.stack)
      throw err
    })
    this.process.stderr.setEncoding('utf8')
    this.process.stderr.on('data', data => {
      console.log('screen stderr:', data)
      this.onErrorCB(data)
    })
    this.process.stdout.setEncoding('utf8')
    this.process.stdout.on('data', data => {
      const out = data.trim()
      console.log(out)
    })
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
    return this
  }

  pause = () => {
    this.setState({ isPaused: true })
    this.socketSend('pause')
    return this
  }

  resume = () => {
    this.setState({ isPaused: false })
    this.socketSend('start')
    return this
  }

  clear = () => {
    this.socketSend('clear')
    return this
  }

  onClear = cb => {
    this.onClearCB = cb
  }

  onClearWord = cb => {
    this.onClearWordCB = cb
  }

  onRestoreWord = cb => {
    this.onRestoreWordCB = cb
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
    clearInterval(this.resourceCheckInt)
    if (this.process === undefined) {
      // null if not recording
      return
    }
    this.process.stdout.removeAllListeners()
    this.process.stderr.removeAllListeners()
    // kill process
    this.process.kill()
    this.process.kill('SIGKILL')
    let hasResolved = false
    setTimeout(() => {
      if (!hasResolved) {
        console.log('still hasnt stopped?')
      }
    }, 5000)
    await this.process
    hasResolved = true
    console.log('killed process')
    delete this.process
    // sleep to avoid issues
    await sleep(20)
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
          console.log(
            'Screen: failed to send to socket, removing',
            err.message,
            id,
          )
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
}

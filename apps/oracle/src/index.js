import Path from 'path'
import execa from 'execa'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Server } from 'ws'
import killPort from 'kill-port'
import monitorScreenProcess from './monitorProcess'
const sleep = ms => new Promise(res => setTimeout(res, ms))

// swift itself
// and the swiftBridge
// both connect to here:
const ORACLE_ROOT = 40512

const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const appPath = bundle =>
  Path.join(
    dir,
    '..',
    'orbit',
    'Build',
    'Products',
    bundle,
    'orbit.app',
    'Contents',
    'MacOS',
  )
const RELEASE_PATH = appPath('Release')
const DEBUG_PATH = appPath('Debug')

export default class Oracle {
  settings = null
  changedIds = null
  restoredIds = null
  awaitingSocket = []
  listeners = []
  onLinesCB = _ => _
  onWindowChangeCB = _ => _
  onWordsCB = _ => _
  onBoxChangedCB = _ => _
  onRestoredCB = _ => _
  onErrorCB = _ => _
  onClearCB = _ => _
  state = {
    isPaused: false,
  }

  setState = async nextState => {
    this.state = { ...this.state, ...nextState }
    await this.socketSend('state', this.state)
  }

  constructor({ debugBuild = false } = {}) {
    this.debugBuild = debugBuild
    macosVersion.assertGreaterThanOrEqualTo('10.12')
  }

  start = async () => {
    // kill old apertures
    try {
      await execa('kill', ['-9', 'orbit'])
    } catch (err) {
      // none
    }
    if (!this.wss) {
      // kill old ones
      await killPort(ORACLE_ROOT)
      this.wss = new Server({ port: ORACLE_ROOT })
      this.setupSocket()
    }
    await this.setState({ isPaused: false })
    await this._runScreenProcess()
    await this._connectToScreenProcess()
    monitorScreenProcess(this.process, this.restart)
  }

  stop = async () => {
    if (!this.process) return
    this.process.stdout.removeAllListeners()
    this.process.stderr.removeAllListeners()
    // kill process
    this.process.kill()
    const killExtra = setTimeout(() => {
      this.process.kill('SIGKILL')
    }, 16)
    await this.process
    delete this.process
    clearTimeout(killExtra)
    // sleep to avoid issues
    await sleep(32)
  }

  restart = async () => {
    await this.stop()
    await this.start()
  }

  watchBounds = async ({
    fps = 25,
    showCursor = true,
    displayId = 'main',
    // how far between pixels to check
    sampleSpacing = 10,
    // how many pixels have to detect diff before triggering onClear
    sensitivity = 2,
    boxes = [],
    debug = false,
  } = {}) => {
    const settings = {
      debug,
      fps,
      showCursor,
      displayId,
      sampleSpacing,
      sensitivity,
      boxes: boxes.map(box => ({
        initialScreenshot: false,
        findContent: false,
        ocr: false,
        screenDir: null,
        ...box,
      })),
    }
    this.settings = settings
    await this.socketSend('watch', settings)
    return this
  }

  pause = async () => {
    await this.setState({ isPaused: true })
    await this.socketSend('pause')
    return this
  }

  resume = async () => {
    await this.setState({ isPaused: false })
    await this.socketSend('start')
    return this
  }

  clear = async () => {
    await this.socketSend('clear')
    return this
  }

  defocus = async () => {
    await this.socketSend('defoc')
    return this
  }

  onClear = cb => {
    this.onClearCB = cb
  }

  onBoxChanged = cb => {
    this.onBoxChangedCB = cb
  }

  onRestored = cb => {
    this.onRestoredCB = cb
  }

  onWords = cb => {
    this.onWordsCB = cb
  }

  onLines = cb => {
    this.onLinesCB = cb
  }

  onWindowChange = cb => {
    this.onWindowChangeCB = cb
  }

  onError = cb => {
    this.onErrorCB = cb
  }

  async socketSend(action, data) {
    if (!this.listeners.length) {
      this.awaitingSocket.push({ action, data })
      return
    }
    // send format is `action data`
    try {
      const strData =
        typeof data === 'object' ? `${action} ${JSON.stringify(data)}` : action
      for (const { socket, id } of this.listeners) {
        try {
          socket.send(strData)
        } catch (err) {
          if (err.message.indexOf('CLOSED')) {
            this.removeSocket(id)
          } else {
            console.log('oracle.socketSend Err', err.stack)
          }
        }
      }
    } catch (err) {
      console.log('screen error parsing socket message', err.message)
    }
    // for now just simulate this async thing actually awaiting receive
    await new Promise(res => setTimeout(res))
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
      // call up to swiftbridge
      const actions = {
        changed: value => {
          setTimeout(() => this.onBoxChangedCB(value))
        },
        changedIds: value => {
          this.changedIds = value
        },
        restored: value => {
          setTimeout(() => this.onRestoredCB(value))
        },
        restoredIds: value => {
          this.restoredIds = value
        },
        // up to listeners of this class
        clear: this.onClearCB,
        words: this.onWordsCB,
        lines: this.onLinesCB,
        // relay down to swift process
        pause: this.pause,
        resume: this.resume,
        start: this.start,
        defocus: this.defocus,
      }
      // coming from swift
      socket.on('message', str => {
        try {
          const { action, value, state } = JSON.parse(str)
          if (state) {
            this.setState(state)
          }
          if (actions[action]) {
            actions[action](value)
          } else {
            // otherwise its a window change event
            if (!action) return
            this.onWindowChangeCB(action, value)
          }
        } catch (err) {
          console.log('Error receiving message', str)
          console.log(err.stack)
        }
      })
      // handle events
      socket.on('close', () => {
        this.removeSocket()
      })
      socket.onerror = err => {
        if (err.message.indexOf('ECONNRESET')) return
        console.log('socket.onerror', err)
      }
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

  _connectToScreenProcess() {
    return new Promise(res => {
      // wait for connection to socket before sending start
      let startWait = setInterval(() => {
        if (this.listeners.length) {
          clearInterval(startWait)
          setTimeout(() => this.socketSend('start'), 10)
          res()
        }
      }, 10)
    })
  }

  async _runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    const binDir = this.debugBuild ? DEBUG_PATH : RELEASE_PATH
    this.process = execa('./orbit', [], {
      cwd: binDir,
      reject: false,
    })
    // never logs :( (tried with spawn too)...
    this.process.stdout.setEncoding('utf8')
    this.process.stdout.on('data', data => {
      console.log('stdout from oracle', data)
    })
    this.process.stderr.setEncoding('utf8')
    this.process.stderr.on('data', data => {
      if (!data) return
      // weird ass workaround for stdout not being captured
      const isLikelyError = data[0] === ' '
      const out = data.trim()
      const isPurposefulLog = out[0] === '!'
      if (isPurposefulLog || isLikelyError) {
        console.log('swift >', out.slice(1))
        return
      }
      if (data.indexOf('<Notice>')) {
        return
      }
      console.log('screen stderr:', data)
      this.onErrorCB(data)
    })
    this.process.catch((err, ...rest) => {
      console.log('screen err:', ...rest)
      console.log(err)
      console.log(err.stack)
      throw err
    })
  }
}

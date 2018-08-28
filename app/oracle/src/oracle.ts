import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Server } from 'ws'
import killPort from 'kill-port'
// import monitorScreenProcess from './monitorProcess'
const sleep = ms => new Promise(res => setTimeout(res, ms))
import { logger } from '@mcro/logger'

const log = logger('oracle')
const idFn = _ => _

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

type OracleInfo = {
  supportsTransparency: boolean
}

export default class Oracle {
  wss: Server
  process: ChildProcess

  socketPort: number
  debugBuild = false
  settings = null
  changedIds = null
  restoredIds = null
  awaitingSocket = []
  listeners = []
  onWindowChangeCB: (a: string, b: any) => any = idFn
  onInfoCB = idFn
  onLinesCB = idFn
  onWordsCB = idFn
  onBoxChangedCB = idFn
  onRestoredCB = idFn
  onErrorCB = idFn
  onClearCB = idFn
  onAccessibleCB = idFn
  onSpaceMoveCB = idFn
  binPath = null
  state = {
    isPaused: false,
  }

  setState = async nextState => {
    this.state = { ...this.state, ...nextState }
    await this.socketSend('state', this.state)
  }

  constructor({ debugBuild = false, socketPort = 40512, binPath = null } = {}) {
    this.binPath = binPath
    this.socketPort = socketPort
    this.debugBuild = debugBuild
    macosVersion.assertGreaterThanOrEqualTo('10.11')
  }

  start = async () => {
    log('start oracle')
    if (!this.wss) {
      // kill old ones
      await killPort(this.socketPort)
      this.wss = new Server({ port: this.socketPort })
      this.setupSocket()
      log('Started socket server')
    }
    await this.setState({ isPaused: false })
    await this.runScreenProcess()
    await this.connectToScreenProcess()
    log('ran process')
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

  hideWindow = async () => {
    await this.socketSend('hide')
    return this
  }

  showWindow = async () => {
    await this.socketSend('show')
    return this
  }

  themeWindow = async (theme: string) => {
    await this.socketSend(`them ${theme}`)
    return this
  }

  positionWindow = async (position: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    await this.socketSend(`posi ${JSON.stringify(position)}`)
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

  getInfo = (): Promise<OracleInfo> => {
    return new Promise(res => {
      this.onInfoCB = info => {
        res(info)
      }
      this.socketSend('info')
    })
  }

  onClear = cb => {
    this.onClearCB = cb
  }

  onSpaceMove = cb => {
    this.onSpaceMoveCB = cb
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

  onAccessible = cb => {
    this.onAccessibleCB = cb
  }

  lastAccessibility = null

  handleAccessibility = async value => {
    // we just got access, need to restart the oracle process (until we can figure out cleaner way)
    if (this.lastAccessibility === false && value === true) {
      console.log(
        'Just got accesibility access, restarting Swift process cleanly...',
      )
      await this.restart()
    }
    // only send on new value
    const newValue = value !== this.lastAccessibility
    this.lastAccessibility = value
    if (newValue) {
      this.onAccessibleCB(value)
    }
  }

  async socketSend(action, data?) {
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
        accessible: this.handleAccessibility,
        // up to listeners of this class
        clear: val => this.onClearCB(val),
        words: val => this.onWordsCB(val),
        lines: val => this.onLinesCB(val),
        info: val => this.onInfoCB(val),
        spaceMove: val => this.onSpaceMoveCB(val),
        // down to swift process
        pause: this.pause,
        resume: this.resume,
        start: this.start,
        defocus: this.defocus,
      }
      // coming from swift
      socket.on('message', str => {
        try {
          const { action, value, state } = JSON.parse(str.toString())
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
        this.removeSocket(id)
      })
      socket.onerror = err => {
        if (err.message.indexOf('ECONNRESET')) return
        console.log('socket.onerror', err)
      }
      socket.on('error', err => {
        // @ts-ignore
        if (err.code !== 'ECONNRESET') {
          throw err
        }
        this.removeSocket(id)
      })
    })
    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }

  private connectToScreenProcess() {
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

  private async runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    let bin = 'orbit'
    let binDir = this.debugBuild ? DEBUG_PATH : RELEASE_PATH
    if (this.binPath) {
      bin = 'oracle'
      binDir = Path.join(this.binPath, '..')
    }
    log(
      `Running oracle app with port ${
        this.socketPort
      } ${bin} at path ${binDir}`,
    )
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env: {
          SOCKET_PORT: `${this.socketPort}`,
        },
      })
    } catch (err) {
      console.log('errror', err)
    }
    log('Connect stdout...')

    const handleOut = data => {
      if (!data) return
      const str = data.toString()
      // weird ass workaround for stdout not being captured
      const isLikelyError = str[0] === ' '
      const out = str.trim()
      const isPurposefulLog = out[0] === '!'
      if (isPurposefulLog || isLikelyError) {
        log('swift >', out.slice(1))
        return
      }
      if (str.indexOf('<Notice>')) {
        return
      }
      console.log('screen stderr:', str)
      this.onErrorCB(str)
    }

    this.process.stdout.on('data', handleOut)
    this.process.stderr.on('data', handleOut)
  }
}

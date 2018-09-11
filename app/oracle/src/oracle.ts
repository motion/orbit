import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { logger } from '@mcro/logger'
import { OracleBridge, SocketSender } from './OracleBridge'

const log = logger('oracle')
const idFn = _ => _
const sleep = ms => new Promise(res => setTimeout(res, ms))
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

export class Oracle {
  env: { [key: string]: string } | null
  port: number
  process: ChildProcess
  oracleBridge: OracleBridge
  socketSend: SocketSender
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

  constructor({
    debugBuild = false,
    socketPort = 40512,
    binPath = null,
    env = null,
  } = {}) {
    this.env = env
    this.port = socketPort
    this.binPath = binPath
    this.debugBuild = debugBuild
    this.oracleBridge = new OracleBridge({
      port: socketPort,
      actions: this.actions,
      setState: this.setState,
      getState: () => this.state,
      onWindowChangeCB: this.onWindowChangeCB,
    })
    macosVersion.assertGreaterThanOrEqualTo('10.11')
  }

  start = async () => {
    log('start oracle')
    await this.oracleBridge.start(({ socketSend }) => {
      this.socketSend = socketSend
    })
    await this.setState({ isPaused: false })
    await this.runScreenProcess()
    await this.connectToScreenProcess()
    log('ran process')
  }

  stop = async () => {
    if (!this.process) {
      return
    }
    log('STOPPING oracle')
    this.process.stdout.removeAllListeners()
    this.process.stderr.removeAllListeners()
    // kill process
    this.process.kill('SIGINT')
    const killExtra = setTimeout(() => {
      this.process.kill('SIGKILL')
    }, 40)
    await this.process
    delete this.process
    clearTimeout(killExtra)
    // sleep to avoid issues
    await sleep(32)
  }

  restart = async () => {
    log('RESTARTING oracle')
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

  actions: { [key: string]: Function } = {
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
    let binDir
    if (this.binPath) {
      bin = 'oracle'
      binDir = Path.join(this.binPath, '..')
    } else {
      binDir = this.debugBuild ? DEBUG_PATH : RELEASE_PATH
    }
    log(`oracle running on port ${this.port} ${bin} at path ${binDir}`)
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env: {
          SOCKET_PORT: `${this.port}`,
          ...this.env,
        },
      })
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
      this.process.on('exit', val => {
        log('ORACLE PROCESS STOPPING', val)
      })
    } catch (err) {
      console.log('errror', err)
    }
  }
}

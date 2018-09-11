import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Logger } from '@mcro/logger'
import { OracleBridge, SocketSender } from './OracleBridge'
import { link } from 'fs'
import { promisify } from 'util'
import { remove } from 'fs-extra'

const linkify = promisify(link)
const log = new Logger('oracle')
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
export class Oracle {
  name?: string
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
  onAppStateCB = idFn
  binPath = null
  state = {
    isPaused: false,
  }

  setState = async nextState => {
    this.state = { ...this.state, ...nextState }
    await this.socketSend('state', this.state)
  }

  constructor({
    name = null,
    debugBuild = false,
    socketPort = 40512,
    binPath = null,
    env = null,
  } = {}) {
    this.name = name
    this.env = env
    this.port = socketPort
    this.binPath = binPath
    this.debugBuild = debugBuild
    macosVersion.assertGreaterThanOrEqualTo('10.11')
  }

  start = async () => {
    log.info('start oracle')
    this.oracleBridge = new OracleBridge({
      port: this.port,
      getActions: () => this.actions,
      setState: this.setState,
      getState: () => this.state,
      onWindowChangeCB: (a, b) => this.onWindowChangeCB(a, b),
    })
    await this.oracleBridge.start(({ socketSend }) => {
      this.socketSend = socketSend
    })
    log.info('started oracleBridge')
    await this.setState({ isPaused: false })
    await this.runOracleProcess()
    await this.oracleBridge.onConnected()
    this.socketSend('start')
    log.info('started oracle')
  }

  stop = async () => {
    if (!this.process) {
      return
    }
    log.info('STOPPING oracle')
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
    log.info('RESTARTING oracle')
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
  }

  hideWindow = async () => {
    await this.socketSend('hide')
  }

  showWindow = async () => {
    await this.socketSend('show')
  }

  themeWindow = async (theme: string) => {
    await this.socketSend(`them ${theme}`)
  }

  positionWindow = async (position: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    await this.socketSend(`posi ${JSON.stringify(position)}`)
  }

  pause = async () => {
    await this.setState({ isPaused: true })
    await this.socketSend('pause')
  }

  resume = async () => {
    await this.setState({ isPaused: false })
    await this.socketSend('start')
  }

  clear = async () => {
    await this.socketSend('clear')
  }

  defocus = async () => {
    await this.socketSend('defoc')
  }

  onInfo = cb => {
    this.onInfoCB = cb
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

  onAppState = cb => {
    this.onAppStateCB = cb
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
    appState: val => {
      this.onAppStateCB(val)
    },
    // down to swift process
    pause: this.pause,
    resume: this.resume,
    start: this.start,
    defocus: this.defocus,
  }

  private async runOracleProcess() {
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
    if (this.name) {
      // create a named binary link to change the name...
      console.log(`linking! ${this.name}`)
      const linkBin = Path.join(binDir, this.name)
      try {
        await remove(linkBin)
      } catch {}
      await linkify(Path.join(binDir, bin), linkBin)
      bin = this.name
    }
    log.info(`oracle running on port ${this.port} ${bin} at path ${binDir}`)
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env: {
          SOCKET_PORT: `${this.port}`,
          ...this.env,
        },
      })
      const handleOut = data => {
        if (!data) return
        const str = data.toString()
        // weird ass workaround for stdout not being captured
        const isLikelyError = str[0] === ' '
        const out = str.trim()
        const isPurposefulLog = out[0] === '!'
        if (isPurposefulLog || isLikelyError) {
          log.info('swift >', this.name, out.slice(1))
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
        log.info('ORACLE PROCESS STOPPING', val)
      })
    } catch (err) {
      console.log('errror', err)
    }
  }
}

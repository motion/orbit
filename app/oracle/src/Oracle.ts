import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import macosVersion from 'macos-version'
import electronUtil from 'electron-util/node'
import { Logger } from '@mcro/logger'
import { OracleBridge, SocketSender } from './OracleBridge'
import { link, mkdir } from 'fs'
import { promisify } from 'util'
import { remove } from 'fs-extra'

const linkify = promisify(link)
const log = new Logger('oracle')
const idFn = _ => _
const sleep = ms => new Promise(res => setTimeout(res, ms))
const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const appPath = bundle =>
  Path.join(dir, '..', 'orbit', 'Build', 'Products', bundle, 'orbit.app', 'Contents', 'MacOS')
const RELEASE_PATH = appPath('Release')
const DEBUG_PATH = appPath('Debug')

export class Oracle {
  onClose?: Function
  name?: string
  env: { [key: string]: string } | null
  socketPort: number
  options = {
    ocr: false,
    appWindow: false,
  }
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
    ocr = false,
    appWindow = false,
    onClose = null,
  } = {}) {
    this.name = name
    this.env = env
    this.socketPort = socketPort
    this.binPath = binPath
    this.debugBuild = debugBuild
    this.options = {
      ocr,
      appWindow,
    }
    this.onClose = onClose
    macosVersion.assertGreaterThanOrEqualTo('10.11')
  }

  start = async () => {
    if (this.options.ocr) {
      try {
        await promisify(mkdir)('/tmp/screen')
      } catch {
        log.info('Couldnt make temp dir for screens')
      }
    }
    this.oracleBridge = new OracleBridge({
      port: this.socketPort,
      getActions: () => this.actions,
      setState: this.setState,
      getState: () => this.state,
    })
    await this.oracleBridge.start(({ socketSend }) => {
      this.socketSend = socketSend
    })
    await this.runOracleProcess()
    await this.oracleBridge.onConnected()
    log.verbose('started oracle')
  }

  stop = async () => {
    if (!this.process) {
      return
    }
    log.info('STOPPING oracle')
    this.process.stdout.removeAllListeners()
    this.process.stderr.removeAllListeners()
    // kill process
    this.process.kill('SIGKILL')
    this.process.kill('SIGINT')
    await this.process
    delete this.process
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

  positionWindow = async (position: { x: number; y: number; width: number; height: number }) => {
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

  async requestAccessibility() {
    await this.socketSend('reac')
    // TODO come up with system to reply with state
    await sleep(30)
  }

  async startWatchingWindows() {
    await this.socketSend('staw')
  }

  async stopWatchingWindows() {
    await this.socketSend('stow')
  }

  spellCallbackCb = null

  spellcheck(words: string) {
    return new Promise(res => {
      const callId = Math.round(Math.random() * 100000000000)
      this.spellCallbackCb = ({ id, guesses }) => {
        console.log('id', id, guesses)
        if (id === callId) {
          res(guesses)
        }
      }
      const spellObj = { words, id: callId }
      this.socketSend(`spell ${JSON.stringify(spellObj)}`)
    })
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

  onAppState = cb => {
    this.onAppStateCB = cb
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
    windowEvent: ({ type, ...values }) => this.onWindowChangeCB(type, values),
    spellCheck: val => {
      if (this.spellCallbackCb) {
        this.spellCallbackCb(val)
      }
    },
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
      log.verbose(`linking! ${this.name}`)
      const linkBin = Path.join(binDir, this.name)
      try {
        await remove(linkBin)
        await linkify(Path.join(binDir, bin), linkBin)
      } catch (err) {
        log.verbose('Got potentially inconsequential link err', err)
      }
      bin = this.name
    }
    const env = {
      RUN_OCR: `${this.options.ocr}`,
      RUN_APP_WINDOW: `${this.options.appWindow}`,
      SOCKET_PORT: `${this.socketPort}`,
      ...this.env,
    }
    const stringEnv = JSON.stringify(env, null, 2)
    log.info(
      `Start Oracle on port ${this.socketPort} ${bin} at path ${binDir} with env:\n${stringEnv}`,
    )
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env,
      })
      const handleOut = data => {
        if (!data) return
        const str = data.toString()
        // weird ass workaround for stdout not being captured
        const isLikelyError = str[0] === ' '
        const out = str.trim()
        const isPurposefulLog = out[0] === '!'
        if (isPurposefulLog || isLikelyError) {
          // log.verbose('swift >>>', this.name, out.slice(1))
          return
        }
        console.log('screen stderr:', str)
        this.onErrorCB(str)
      }

      this.process.stdout.on('data', handleOut)
      this.process.stderr.on('data', handleOut)
      this.process.on('exit', val => {
        log.info('ORACLE PROCESS STOPPING', this.socketPort, val)
        if (this.onClose) {
          this.onClose()
        }
      })
    } catch (err) {
      console.log('errror', err)
    }
  }
}

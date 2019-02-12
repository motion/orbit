import { Logger } from '@mcro/logger'
import { ChildProcess, spawn } from 'child_process'
import electronUtil from 'electron-util/node'
import { mkdir } from 'fs'
import macosVersion from 'macos-version'
import Path from 'path'
import { promisify } from 'util'
import { ScreenBridge, SocketSender } from './ScreenBridge'

const log = new Logger('screen')
const idFn = _ => _
const sleep = ms => new Promise(res => setTimeout(res, ms))
const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const appPath = bundle =>
  Path.join(dir, '..', 'orbit', 'Build', 'Products', bundle, 'orbit.app', 'Contents', 'MacOS')
const RELEASE_PATH = appPath('Release')
const DEBUG_PATH = appPath('Debug')

export class Screen {
  //public
  socketSend: SocketSender

  private onClose?: Function
  private env: { [key: string]: string } | null
  private socketPort: number
  private options = {
    ocr: false,
    appWindow: false,
    showTray: false,
  }
  private process: ChildProcess
  private screenBridge: ScreenBridge
  private debugBuild = false
  private onInfoCB = idFn
  private onErrorCB = idFn
  private onSpaceMoveCB = idFn
  private onTrayStateCB = idFn
  private binPath = null
  private state = {
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
    ocr = false,
    showTray = false,
    appWindow = false,
    onClose = null,
  } = {}) {
    this.env = env
    this.socketPort = socketPort
    this.binPath = binPath
    this.debugBuild = debugBuild
    this.options = {
      ocr,
      appWindow,
      showTray,
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
    this.screenBridge = new ScreenBridge({
      port: this.socketPort,
      getActions: () => this.actions,
      setState: this.setState,
      getState: () => this.state,
    })
    await this.screenBridge.start(({ socketSend }) => {
      this.socketSend = socketSend
    })
    await this.runScreenProcess()
    await this.screenBridge.onConnected()
    log.verbose('started screen')
  }

  stop = async () => {
    if (!this.process) {
      return
    }
    log.info('STOPPING screen')
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
    log.info('RESTARTING screen')
    await this.stop()
    await this.start()
  }

  defocus = async () => {
    await this.socketSend('defoc')
  }

  async startWatchingWindows() {
    await this.socketSend('staw')
  }

  async stopWatchingWindows() {
    await this.socketSend('stow')
  }

  getInfo = async () => {
    await this.socketSend('osin')
  }

  onInfo = cb => {
    this.onInfoCB = cb
  }

  onSpaceMove = cb => {
    this.onSpaceMoveCB = cb
  }

  onError = cb => {
    this.onErrorCB = cb
  }

  onTrayState = cb => {
    this.onTrayStateCB = cb
  }

  actions: { [key: string]: Function } = {
    // up to listeners of this class
    info: val => this.onInfoCB(val),
    spaceMove: val => this.onSpaceMoveCB(val),
    trayState: val => {
      this.onTrayStateCB(val)
    },
    // down to swift process
    defocus: this.defocus,
  }

  private async runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    let bin = 'orbit'
    let binDir
    if (this.binPath) {
      binDir = Path.join(this.binPath, '..')
    } else {
      binDir = this.debugBuild ? DEBUG_PATH : RELEASE_PATH
    }
    const env = {
      RUN_OCR: `${this.options.ocr}`,
      RUN_APP_WINDOW: `${this.options.appWindow}`,
      SOCKET_PORT: `${this.socketPort}`,
      SHOW_TRAY: `${this.options.showTray && !process.env.DISABLE_ELECTRON}`,
      NODE_ENV: process.env.NODE_ENV,
      ...this.env,
    }
    log.info(`Start Screen on port ${this.socketPort} ${bin} at path ${binDir}`)
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env,
      })
      const handleOut = data => {
        if (!data) return
        const str = data.toString()
        // weird ass workaround for stdout not being captured
        const canIgnoreErr = str.indexOf('Could not watch application') >= 0
        if (canIgnoreErr) {
          // log.verbose('swift >>>', this.name, out.slice(1))
          return
        }
        console.log('Screen stderr:', str)
        this.onErrorCB(str)
      }

      this.process.stdout.on('data', handleOut)
      this.process.stderr.on('data', handleOut)
      this.process.on('exit', val => {
        log.info('Screen PROCESS STOPPING', this.socketPort, val)
        if (this.onClose) {
          this.onClose()
        }
      })
    } catch (err) {
      console.log('errror', err)
    }
  }
}

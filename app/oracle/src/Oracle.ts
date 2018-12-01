import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import electronUtil from 'electron-util/node'
import { Logger } from '@mcro/logger'

const log = new Logger('screen')
const sleep = ms => new Promise(res => setTimeout(res, ms))
const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const bin = 'Oracle'
const appPath = bundle =>
  Path.join(dir, '..', 'Build', 'Products', bundle, 'Oracle.app', 'Contents', 'MacOS')
const RELEASE_PATH = appPath('Release')

export class Oracle {
  private process: ChildProcess
  private binPath = null

  constructor({ binPath = null } = {}) {
    this.binPath = binPath
  }

  start = async () => {
    await this.runScreenProcess()
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

  actions: { [key: string]: Function } = {}

  private async runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    let binDir
    if (this.binPath) {
      bin = 'screen'
      binDir = Path.join(this.binPath, '..')
    } else {
      binDir = RELEASE_PATH
    }
    log.info(`Start on port ${bin} at path ${binDir}`)
    try {
      this.process = spawn(Path.join(binDir, bin), [], { env: {} })

      this.process.stdout.on('data', this.handleOut)
      this.process.stderr.on('data', this.handleOut)
      this.process.on('exit', () => {
        log.info('PROCESS STOPPING')
      })
    } catch (err) {
      console.log('errror', err)
    }
  }

  handleOut = data => {
    if (!data) return
    const str = data.toString()
    console.log('Screen:', str)
  }
}

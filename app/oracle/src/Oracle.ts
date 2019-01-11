import Path from 'path'
import { spawn, ChildProcess } from 'child_process'
import electronUtil from 'electron-util/node'
import { Logger } from '@mcro/logger'
import { Server } from 'ws'

const log = new Logger('screen')
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
const dir = electronUtil.fixPathForAsarUnpack(__dirname)
const bin = 'Oracle'
const appPath = (bundle: string) =>
  Path.join(dir, '..', 'Build', 'Products', bundle, 'Oracle.app', 'Contents', 'MacOS')
const RELEASE_PATH = appPath('Release')

export type OracleOptions = {
  binPath?: string
  port: number
  onMessage: OracleMessageHandler
}

// message types

interface Message {
  message: string
}

interface TrayBoundsMessage extends Message {
  message: 'trayBounds'
  value: {
    position: [number, number]
    size: [number, number]
  }
}

interface TrayHoverMessage extends Message {
  message: 'trayHover'
  value: {
    id: '0' | '1' | '2' | 'Out'
  }
}

type OracleMessage = TrayHoverMessage | TrayBoundsMessage

type Narrow<T, K> = T extends { message: K } ? T : never

export type OracleMessageHandler = (<K extends OracleMessage['message']>(
  message: K,
  value: Narrow<OracleMessage, K>,
) => void)

export class Oracle {
  private process: ChildProcess
  private server: Server
  private socket: any
  private resolveSocketConnected: Function
  private socketConnected = new Promise(res => (this.resolveSocketConnected = res))

  constructor(public options: OracleOptions) {
    this.server = new Server({ port: options.port })
    this.options = options

    this.server.on('error', (...args) => {
      console.error('server error', args)
    })
    this.setupServer()
  }

  start = async () => {
    await this.runScreenProcess()
    await this.socketConnected
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

  send = () => {
    this.socket.send('')
  }

  private async runScreenProcess() {
    if (this.process !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    const binDir = this.options.binPath ? Path.join(this.options.binPath, '..') : RELEASE_PATH
    log.info(`Start on port ${bin} at path ${binDir}`)
    try {
      this.process = spawn(Path.join(binDir, bin), [], {
        env: {
          SOCKET_PORT: `${this.options.port}`,
        },
      })

      const handleOut = data => {
        if (!data) return
        const str = data.toString()
        log.info('Oracle process:', str)
      }

      this.process.stdout.on('data', handleOut)
      this.process.stderr.on('data', handleOut)
      this.process.on('exit', () => {
        log.info('PROCESS STOPPING')
      })
    } catch (err) {
      log.error('errror', err)
    }
  }

  private setupServer() {
    this.server.on('connection', socket => {
      this.socket = socket
      this.resolveSocketConnected()

      socket.on('message', str => {
        const { action, value } = JSON.parse(str.toString())
        this.options.onMessage(action, value)
      })

      socket.on('error', err => {
        log.error('socket error', err)
      })
    })
  }
}

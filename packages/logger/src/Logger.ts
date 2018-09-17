import { LOGGER_COLOR_WHEEL } from './constants'
import { LoggerSettings } from './LoggerSettings'

const voidfn = (...args: any[]) => args
let log

if (typeof window !== 'undefined') {
  // disable in renderer for now because were avoiding compiling it to electron
  log = {
    info: voidfn,
    debug: voidfn,
    warn: voidfn,
    error: voidfn,
  }
} else {
  // just use it for its simple/nice file log writing
  log = require('electron-log')
  // disable console output from electron-log
  // @ts-ignore
  log.transports.console = () => {}
}

// electron doesnt have console.debug...
const debug = (...args) => (console.debug ? console.debug(...args) : console.info(...args))

type LoggerOpts = {
  trace?: boolean
}

const has = (x, y) => x.indexOf(y) > -1

const knownUselessLog = str => {
  // our own stack
  if (has(str, 'at Logger.log')) return true
  // ignore double understor function names
  if (has(str, 'at __')) return true
  // common ts compiled code
  if (has(str, 'at res ')) return true
  // mobx...
  if (has(str, 'at executeAction$')) return true
  if (has(str, 'at Reaction$')) return true
  if (has(str, 'at runReactionsHelper')) return true
  if (has(str, 'at reactionScheduler')) return true
  if (has(str, 'at batchedUpdates$')) return true
  if (has(str, 'at endBatch$')) return true
  if (has(str, 'at endAction')) return true
  return false
}

/**
 * Creates a new logger with a new namespace.
 */
export class Logger {
  private opts: LoggerOpts
  private namespace: string
  private timers: {
    message: string
    time: number
  }[] = []

  constructor(namespace: string, opts: LoggerOpts = { trace: false }) {
    this.namespace = namespace
    this.opts = opts
  }

  /**
   * Logs in a verbose mode.
   */
  verbose(...messages: any[]) {
    this.log('verbose', messages)
  }

  /**
   * Logs in a info mode.
   */
  info(...messages: any[]) {
    this.log('info', messages)
  }

  /**
   * Logs in a warning mode.
   */
  warning(...messages: any[]) {
    this.log('warning', messages)
  }

  /**
   * Logs in error mode.
   */
  error(...messages: any[]) {
    this.log('error', messages)
  }

  /**
   * Creates a timer that logs messages and tracks a period between
   * given label message and next timer call with the same label message.
   */
  timer(label: string, ...messages: any[]) {
    this.log('timer', [label, ...messages])
  }

  /**
   * Chainable API to trace the current log
   * can be used like:
   *    log.trace.info(...)
   */
  get trace() {
    return new Logger(this.namespace, { trace: true })
  }

  /**
   * Executes logging.
   */
  private log(level: 'verbose' | 'info' | 'warning' | 'error' | 'timer', messages: any[]) {
    // don't log if we have logging disabled
    const index = LoggerSettings.disables.indexOf(this.namespace)
    if (level !== 'error' && index !== -1) return

    // push namespace to the list if its still not in there
    if (LoggerSettings.namespaces.indexOf(this.namespace) === -1)
      LoggerSettings.namespaces.push(this.namespace)

    // get the namespace color
    const color =
      LOGGER_COLOR_WHEEL[
        LoggerSettings.namespaces.indexOf(this.namespace) % LOGGER_COLOR_WHEEL.length
      ]

    // adds a stack trace
    if (this.opts.trace) {
      let where = new Error().stack
      const { STACK_FILTER } = process.env
      if (STACK_FILTER) {
        // replace stack so it looks less stack-y
        const dontFilter = STACK_FILTER === 'true'
        const replace = dontFilter ? '' : new RegExp(` \\([^\\)]*${STACK_FILTER}`)
        where = where
          .split('\n')
          // filter
          .filter(x => x.indexOf(STACK_FILTER) > -1 && !knownUselessLog(x))
          // cleanup formatting
          .map(x =>
            x
              .replace(replace, dontFilter ? '*****' : ` in (${STACK_FILTER}`)
              // normalizes the traces irregular first line width
              .replace(/^\s+at/, '  at'),
          )
          // remove the first line "Error" and cap at 10 lines
          .slice(1, 10)
          .join('\n')
      }
      if (where) {
        messages = [...messages, `\n log trace:\n${where}`]
      }
    }

    // output to the console
    // todo: in the production we'll need to output into our statistics/logger servers
    if (level === 'error') {
      console.error(`%c ${this.namespace} `, 'color: white; background-color: red', ...messages)
      log.error(this.namespace, ...messages)
    } else if (level === 'warning') {
      console.warn(`%c ${this.namespace} `, 'color: white; background-color: yellow', ...messages)
      log.warn(this.namespace, ...messages)
    } else if (level === 'verbose') {
      debug(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
      log.debug(this.namespace, ...messages)
    } else if (level === 'info') {
      console.info(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
      log.info(this.namespace, ...messages)
    } else if (level === 'timer') {
      const labelMessage = messages[0]
      const existTimer = this.timers.find(timer => timer.message === labelMessage)
      if (existTimer) {
        const delta = (Date.now() - existTimer.time) / 1000
        debug(
          `%c${this.namespace}%c${delta}ms`,
          `color: ${color}; font-weight: bold`,
          'color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px',
          ...messages,
        )
        log.debug(this.namespace, delta, ...messages)
        this.timers.splice(this.timers.indexOf(existTimer), 1)
      } else {
        debug(
          `%c${this.namespace}%cstarted`,
          `color: ${color}; font-weight: bold`,
          'color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px',
          ...messages,
        )
        log.debug(this.namespace, 'started', ...messages)
        this.timers.push({ time: Date.now(), message: messages[0] })
      }
    } else {
      console.log(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
      log.info(this.namespace, ...messages)
    }
  }
}

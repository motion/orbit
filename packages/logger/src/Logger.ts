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
  if (has(str, 'at Logger.')) return true
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
   * Creates a timer that logs messages in a verbose mode and tracks a period between
   * given label message and next timer call with the same label message.
   */
  vtimer(label: string, ...messages: any[]) {
    this.log('vtimer', [label, ...messages])
  }

  /**
   * Cleans log timers.
   */
  clean() {
    this.timers = []
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
  private log(
    level: 'verbose' | 'info' | 'warning' | 'error' | 'timer' | 'vtimer',
    messages: any[],
  ) {
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

    const isTrace = this.opts.trace && process.env.NODE_ENV === 'development'
    const loggingEnabled = !process.env.DISABLE_LOGGING // || process.env.PROCESS_NAME !== 'syncers'

    // adds a stack trace
    // only do this in development it adds a decent amount of overhead
    let traceLog
    if (isTrace) {
      let where = new Error().stack
      const { STACK_FILTER } = process.env
      if (STACK_FILTER) {
        // replace stack so it looks less stack-y
        const simpleStackFilter = STACK_FILTER === 'true'
        where = where
          .split('\n')
          .filter(x => {
            let shouldKeep = !knownUselessLog(x)
            if (!simpleStackFilter) {
              shouldKeep = shouldKeep && x.indexOf(STACK_FILTER) > -1
            }
            return shouldKeep
          })
          // cleanup formatting
          .map(x => {
            // normalizes the traces irregular first line width
            let res = x.replace(/^\s+at/, '  ->')
            if (!simpleStackFilter) {
              // remove some extra stuff from the trace
              const replace = new RegExp(`\\([^\\)]*${STACK_FILTER}`)
              res = res.replace(replace, `in ./app/${STACK_FILTER}`)
            }
            return res
          })
          // remove the first line "Error" and cap at lesser lines
          .slice(1, 4)
          .join('\n')
      }
      if (where) {
        traceLog = `\n${where}`
      }
    }

    // group traces to avoid large things clogging console
    if (isTrace) {
      console.groupCollapsed(`${this.namespace}`, ...messages)
      console.log(traceLog)
    }

    // output to the console
    // todo: in the production we'll need to output into our statistics/logger servers
    if (level === 'error') {
      console.error(
        `%c${this.namespace}`,
        'color: white; background-color: red; padding: 0 2px; margin: 0 2px',
        ...messages,
      )
      log.error(this.namespace, ...messages)
    } else if (level === 'warning') {
      console.warn(
        `%c${this.namespace}`,
        'color: #666; background-color: yellow; padding: 0 2px; margin: 0 2px',
        ...messages,
      )
      log.warn(this.namespace, ...messages)
    } else if (level === 'verbose') {
      if (loggingEnabled) {
        debug(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
        log.debug(this.namespace, ...messages)
      }
    } else if (level === 'info') {
      console.info(
        `%c${this.namespace}`,
        `color: ${color}; font-weight: bold; padding: 0 2px; margin: 0 2px`,
        ...messages,
      )
      log.info(this.namespace, ...messages)
    } else if (level === 'timer' || level === 'vtimer') {
      const consoleLog =
        level === 'timer' ? console.info.bind(console) : console.debug.bind(console)
      const defaultLog = level === 'timer' ? log.info.bind(log) : log.debug.bind(log)
      const labelMessage = messages[0]
      const existTimer = this.timers.find(timer => timer.message === labelMessage)
      if (existTimer) {
        const delta = (Date.now() - existTimer.time) / 1000
        // reset it so we can see time since last message each message
        existTimer.time = Date.now()
        consoleLog(
          `%c${this.namespace}%c${delta}ms`,
          `color: ${color}; font-weight: bold`,
          'color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px',
          ...messages,
        )
        defaultLog(this.namespace, delta, ...messages)
        this.timers.splice(this.timers.indexOf(existTimer), 1)
      } else {
        consoleLog(
          `%c${this.namespace}%cstarted`,
          `color: ${color}; font-weight: bold`,
          'color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px',
          ...messages,
        )
        defaultLog(this.namespace, 'started', ...messages)
        this.timers.push({ time: Date.now(), message: messages[0] })
      }
    } else {
      if (loggingEnabled) {
        console.log(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
        log.info(this.namespace, ...messages)
      }
    }

    if (isTrace) {
      console.groupEnd()
    }
  }
}

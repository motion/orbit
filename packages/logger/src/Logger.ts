import { LOGGER_COLOR_WHEEL } from './constants'
import { LoggerSettings } from './LoggerSettings'

const voidfn = (...args: any[]) => args
let log = {
  info: voidfn,
  debug: voidfn,
  warn: voidfn,
  error: voidfn,
}

// // disable in renderer for now because were avoiding compiling it to electron
// if (typeof window === 'undefined') {
//   try {
//     const electronLog = require('electron-log')
//     if (electronLog) {
//       // just use it for its simple/nice file log writing
//       log = electronLog
//       // disable console output from electron-log
//       // @ts-ignore
//       log.transports.console = () => {}
//     }
//   } catch {
//     console.debug('no electron-log in this env')
//   }
// }

type LogType = 'verbose' | 'info' | 'warning' | 'error' | 'timer' | 'vtimer'

// for now just log because its not being output anywhere
const debug = (...args) => {
  if (typeof window !== 'undefined') {
    console.debug(...args)
  } else {
    console.log(...args)
  }
}

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
   * Logs an error then exits.
   */
  panic(...messages: any[]) {
    this.error(
      ...messages,
      `\n\n If this looks like an Orbit issue, open an issue on https://github.com/motion/orbit/issues`,
    )
    if (process.env.DEBUG) {
      console.trace('Panic trace')
    }
    process.exit(1)
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

  private shouldLogAll(type: LogType) {
    const level = process.env.LOG_LEVEL ? +process.env.LOG_LEVEL : 2
    if (type === 'error') {
      return true
    }
    if (type === 'info') {
      return level > 3
    }
    if (type === 'verbose') {
      return level > 4
    }
    return level > 5
  }

  /**
   * Executes logging.
   */
  private log(level: LogType, messages: any[]) {
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

    const isDevelopment = process.env.NODE_ENV === 'development'
    const isTrace = this.opts.trace && isDevelopment
    const shouldLogAll = this.shouldLogAll(level)
    const logLevel = process.env.LOG_LEVEL ? +process.env.LOG_LEVEL : 0

    // for syncer process with no-logging mode we do not log objects in messages
    if (!shouldLogAll) {
      messages = [messages[0]]
    }

    // adds a stack trace
    // only do this in development it adds a decent amount of overhead
    let traceLog
    if (isTrace) {
      let where = `${new Error().stack}`
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
        ...colored(
          this.namespace,
          'color: white; background-color: red; padding: 0 2px; margin: 0 2px',
        ),
        ...messages,
      )
      log.error(this.namespace, ...messages)
    } else if (level === 'warning') {
      if (logLevel > 1) {
        console.warn(
          ...colored(
            this.namespace,
            'color: #666; background-color: yellow; padding: 0 2px; margin: 0 2px',
          ),
          ...messages,
        )
      }
      log.warn(this.namespace, ...messages)
    } else if (level === 'verbose') {
      if (logLevel > 2) {
        debug(...colored(this.namespace, `color: ${color}; font-weight: bold`), ...messages)
        log.debug(this.namespace, ...messages)
      }
    } else if (level === 'info') {
      if (logLevel > 0) {
        console.log(
          ...colored(
            this.namespace,
            `color: ${color}; font-weight: bold; padding: 0 2px; margin: 0 2px`,
          ),
          ...messages,
        )
      }
      log.info(this.namespace, ...messages)
    } else if (level === 'timer' || level === 'vtimer') {
      if (logLevel > 2 || (level === 'timer' && logLevel > 0)) {
        const consoleLog =
          level === 'timer' ? console.info.bind(console) : console.debug.bind(console)
        const defaultLog = level === 'timer' ? log.info.bind(log) : log.debug.bind(log)
        const labelMessage = messages[0]
        const existTimer = this.timers.find(timer => timer.message === labelMessage)
        if (existTimer) {
          const delta = (Date.now() - existTimer.time) / 1000
          // reset it so we can see time since last message each message
          existTimer.time = Date.now()
          consoleLog(`${this.namespace} ${delta}ms`, ...messages)
          defaultLog(this.namespace, delta, ...messages)
          this.timers.splice(this.timers.indexOf(existTimer), 1)
        } else {
          consoleLog(`${this.namespace}`, ...messages)
          defaultLog(this.namespace, 'started', ...messages)
          this.timers.push({ time: Date.now(), message: messages[0] })
        }
      }
    } else {
      console.log(...colored(this.namespace, `color: ${color}; font-weight: bold`), ...messages)
      log.info(this.namespace, ...messages)
    }

    if (isTrace) {
      console.groupEnd()
    }
  }
}

const isNode =
  typeof process !== 'undefined' && process['release'] && process['release'].name === 'node'
const colored = (ns: string, style: string) => {
  return isNode === false ? [`%c${ns}`, style] : [ns]
}

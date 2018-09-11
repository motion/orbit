import { LOGGER_COLOR_WHEEL } from './constants'
import { LoggerSettings } from './LoggerSettings'

/**
 * Creates a new logger with a new namespace.
 */
export class Logger {

  private namespace: string
  private timers: {
    message: string
    time: number
  }[] = []

  constructor(namespace: string) {
    this.namespace = namespace
  }

  /**
   * Logs in a verbose mode.
   */
  verbose(...messages: any[]) {
    this.log("verbose", messages)
  }

  /**
   * Logs in a info mode.
   */
  info(...messages: any[]) {
    this.log("info", messages)
  }

  /**
   * Logs in a warning mode.
   */
  warning(...messages: any[]) {
    this.log("warning", messages)
  }

  /**
   * Logs in error mode.
   */
  error(...messages: any[]) {
    this.log("error", messages)
  }

  /**
   * Creates a timer that logs messages and tracks a period between
   * given label message and next timer call with the same label message.
   */
  timer(label: string, ...messages: any[]) {
    this.log("timer", [label, ...messages])
  }

  /**
   * Executes logging.
   */
  private log(level: "verbose"|"info"|"warning"|"error"|"timer", messages: any[]) {

    // don't log if we have logging disabled
    const index = LoggerSettings.disables.indexOf(this.namespace)
    if (level !== "error" && index !== -1)
      return

    // push namespace to the list if its still not in there
    if (LoggerSettings.namespaces.indexOf(this.namespace) === -1)
      LoggerSettings.namespaces.push(this.namespace)

    // get the namespace color
    const color = LOGGER_COLOR_WHEEL[LoggerSettings.namespaces.indexOf(this.namespace) % LOGGER_COLOR_WHEEL.length]

    // output to the console
    // todo: in the production we'll need to output into our statistics/logger servers
    if (level === "error") {
      console.error(`%c ${this.namespace} `, `color: white; background-color: red`, ...messages)

    } else if (level === "warning") {
      console.warn(`%c ${this.namespace} `, `color: white; background-color: yellow`, ...messages)

    } else if (level === "verbose") {
      console.debug(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)

    } else if (level === "info") {
      console.info(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)

    } else if (level === "timer") {

      const labelMessage = messages[0]
      const existTimer = this.timers.find(timer => timer.message === labelMessage)
      if (existTimer) {
        const delta = (Date.now() - existTimer.time) / 1000
        console.debug(`%c${this.namespace}%c${delta}ms`, `color: ${color}; font-weight: bold`, `color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px`, ...messages)
        this.timers.splice(this.timers.indexOf(existTimer), 1)

      } else {
        console.debug(`%c${this.namespace}%cstarted`, `color: ${color}; font-weight: bold`, `color: #333; background-color: #EEE; padding: 0 2px; margin: 0 2px`, ...messages)
        this.timers.push({ time: Date.now(), message: messages[0] })
      }

    } else {
      console.log(`%c${this.namespace}`, `color: ${color}; font-weight: bold`, ...messages)
    }
  }

}

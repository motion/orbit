/**
 * Colors used in the logger.
 */
const colorWheel = [
  '#DB0A5B',
  '#3455DB',
  '#008040',
  '#005555',
  '#007FAA',
  '#0000E0',
  '#9B59B6',
  '#7462E0',
  '#8B008B',
  '#8B008B',
  '#483D8B',
  '#8D6708',
  '#D43900',
  '#802200',
  '#AA2E00',
  '#870C25',
]

/**
 * Logs everything.
 */
export const Logger = {

  /**
   * List of all namespaces used by a logger.
   */
  namespaces: [] as string[],

  /**
   * List of disabled namespaces.
   */
  disables: [] as string[],

  /**
   * Enables everything logging.
   * If specific namespaces are given it loud only them.
   */
  loud(...namespaces: string[]) {

    // if no namespaces were specified - we loud them all
    if (!namespaces.length) {
      this.disables = []
      return
    }

    // filter namespaces
    const allNamespaces = this.filterNamespaces(this.namespaces, namespaces)

    // disable everything not louded
    this.disables = this.namespaces.filter(namespace => {
      return allNamespaces.indexOf(namespace) === -1
    })
  },

  /**
   * Disables logging.
   * If specific namespaces are given it quiet only them.
   */
  quiet(...namespaces: string[]) {

    // if no namespaces were specified - we quiet them all
    if (!namespaces.length) {
      this.disables = [...this.namespaces]
      return
    }

    // filter namespaces
    const allNamespaces = this.filterNamespaces(this.namespaces, namespaces)

    // quiet specified namespaces
    for (let namespace of allNamespaces) {
      if (this.disables.indexOf(namespace) === -1) {
        this.disables.push(namespace)
      }
    }
  },

  /**
   * Filters given namespaces.
   */
  filterNamespaces(allNamespaces: string[], filteredNamespaces: string[]) {
    const wildcardNamespaces = filteredNamespaces.filter(namespace => {
      return namespace.indexOf("*") !== -1
    })
    const fullNameNamespaces = filteredNamespaces.filter(namespace => {
      return namespace.indexOf("*") === -1
    })
    const fromWildCardNamespaces = allNamespaces.filter(namespace => {
      return wildcardNamespaces.some(wildcardNamespace => {
        const prefix = wildcardNamespace.substr(0, wildcardNamespace.indexOf("*") - 1)
        const namespacePrefix = namespace.substr(0, prefix.length)
        return prefix === namespacePrefix
      })
    })
    return [...fullNameNamespaces, ...fromWildCardNamespaces]
  }

}

/**
 * Logger interface.
 */
export type LoggerInterface = (...messages: any[]) => void

/**
 * Creates a new namespace-based logger.
 *
 * @deprecated use new LoggerInstance() instead
 */
export function logger(namespace: string): LoggerInterface {
  const instance = new LoggerInstance(namespace)
  return function(...messages: any[]) {

    // if message is an error - we have a special formatting for it
    // also we always show errors no matter if their logging is disabled or not
    const isError = typeof messages[0] === "string" && messages[0] === "error"

    if (isError) {
      messages.splice(0, 1)
      instance.error(...messages)
    } else {
      instance.info(...messages)
    }
  }
}

export class LoggerInstance {

  private namespace: string
  private timers: {
    message: string
    time: number
  }[] = []

  constructor(namespace: string) {
    this.namespace = namespace
  }

  verbose(...messages: any[]) {
    this.log("verbose", messages)
  }

  info(...messages: any[]) {
    this.log("info", messages)
  }

  warning(...messages: any[]) {
    this.log("warning", messages)
  }

  error(...messages: any[]) {
    this.log("error", messages)
  }

  timer(...messages: any[]) {
    this.log("timer", messages)
  }

  /**
   * Executes logging.
   */
  private log(level: "verbose"|"info"|"warning"|"error"|"timer", messages: any[]) {

    // don't log if we have logging disabled
    const index = Logger.disables.indexOf(this.namespace)
    if (level !== "error" && index !== -1)
      return

    // push namespace to the list if its still not in there
    if (Logger.namespaces.indexOf(this.namespace) === -1)
      Logger.namespaces.push(this.namespace)

    // get the namespace color
    const color = colorWheel[Logger.namespaces.indexOf(this.namespace) % colorWheel.length]

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
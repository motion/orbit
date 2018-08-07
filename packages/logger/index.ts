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
 * Executes logging.
 */
function log(namespace: string, messages: any[]) {

  // if message is an error - we have a special formatting for it
  // also we always show errors no matter if their logging is disabled or not
  const isError = typeof messages[0] === "string" && messages[0] === "error"

  // don't log if we have logging disabled
  const index = Logger.disables.indexOf(namespace)
  if (isError === false && index !== -1)
    return

  // push namespace to the list if its still not in there
  if (Logger.list.indexOf(namespace) === -1)
    Logger.list.push(namespace)

  // output to the console
  // todo: in the production we'll need to output into our statistics/logger servers
  if (isError) {
    console.error(`%c ${namespace} `, `color: white; background-color: red`, ...messages)

  } else {
    const color = colorWheel[Logger.list.indexOf(namespace) % colorWheel.length]
    console.log(`%c${namespace}`, `color: ${color}; font-weight: bold`, ...messages)
  }
}

/**
 * Logs everything.
 */
export const Logger = {

  /**
   * List of all namespaces used by a logger.
   */
  list: [] as string[],

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

    // otherwise loud namespaces we need
    this.list = namespaces
    // for (let namespace of namespaces) {
    //   const index = this.disables.indexOf(namespbridgeace)
    //   if (index !== -1) {
    //     this.disables.splice(index, 1)
    //   }
    // }
  },

  /**
   * Disables logging.
   * If specific namespaces are given it quiet only them.
   */
  quiet(...namespaces: string[]) {

    // if no namespaces were specified - we quiet them all
    if (!namespaces.length) {
      this.disables = [...this.list]
      return
    }

    // otherwise quiet namespaces we need
    for (let namespace of namespaces) {
      if (this.disables.indexOf(namespace) === -1) {
        this.disables.push(namespace)
      }
    }
  }

}

/**
 * Creates a new namespace-based logger.
 */
export function logger(namespace: string) {
  return function(...messages: any[]) {
    log(namespace, messages)
  }
}
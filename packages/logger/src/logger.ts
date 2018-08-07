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

  // if its an error then remove "error" message
  if (isError)
    messages.splice(0, 1)

  // don't log if we have logging disabled
  const index = Logger.disables.indexOf(namespace)
  if (isError === false && index !== -1)
    return

  // push namespace to the list if its still not in there
  if (Logger.namespaces.indexOf(namespace) === -1)
    Logger.namespaces.push(namespace)

  // output to the console
  // todo: in the production we'll need to output into our statistics/logger servers
  if (isError) {
    console.error(`%c ${namespace} `, `color: white; background-color: red`, ...messages)

  } else {
    const color = colorWheel[Logger.namespaces.indexOf(namespace) % colorWheel.length]
    console.log(`%c${namespace}`, `color: ${color}; font-weight: bold`, ...messages)
  }
}

/**
 * Filters given namespaces.
 */
function filterNamespaces(allNamespaces: string[], filteredNamespaces: string[]) {
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
    const allNamespaces = filterNamespaces(this.namespaces, namespaces)

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
    const allNamespaces = filterNamespaces(this.namespaces, namespaces)

    // quiet specified namespaces
    for (let namespace of allNamespaces) {
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
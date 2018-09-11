
/**
 * Logs everything.
 */
export const LoggerSettings = {

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

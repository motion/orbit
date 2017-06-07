export default class Cache {
  cache = {}
  revive(module, provides) {
    if (module.hot.data) {
      this.cache[module.id] = this.getCached(module.hot.data, provides)
    }
  }
  restore(instance, provides, module) {
    if (!module || !module.hot) {
      return provides
    }
    const restored = this.previous(instance, module.id)
    return Object.keys(provides).reduce(
      (acc, key) => ({
        ...acc,
        [key]: restored[key] || provides[key],
      }),
      {}
    )
  }
  // private
  getCached({ stores }, current): Object<string, Store> {
    let result = {}
    if (stores) {
      const storeNames = Object.keys(stores)
      for (const key of storeNames) {
        const store = stores[key]
        result[key] = store
      }
    }
    return result
  }
  previous(instance, id) {
    const result = {}
    // restore
    if (this.cache[id]) {
      const cached = this.cache[id]
      if (cached._isKeyed_) {
        Object.assign(result, cached[instance.props.storeKey])
      } else {
        Object.assign(result, cached)
      }
    }
    return result
  }
}

export default class IndexedDB {
  IDB = window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB

  constructor(options) {
    this.options = this.getDefaultOptions(options)
    this.open = this.IDB.open(this.options.name, this.options.version)
    this.open.onupgradeneeded = this.handleUpgrade
    this.open.onsuccess = this.handleSuccess
    this.open.onerror = this.handleError
  }

  getDefaultOptions = (options = {}) => {
    const {
      version = 1,
      name = 'MyDatabase3',
      storeName = 'MyObjectStore',
      keyPath = { keyPath: 'id' },
      indexes = [],
    } = options
    return {
      version,
      name,
      storeName,
      keyPath,
      indexes,
    }
  }

  handleError = err => {
    throw new Error(err)
  }

  handleUpgrade = () => {
    const db = this.open.result
    const store = db.createObjectStore(
      this.options.storeName,
      this.options.keyPath
    )
    for (const { name, fields } of this.options.indexes) {
      store.createIndex(name, fields)
    }
  }

  transact = (type = 'readwrite') => {
    const transaction = this.db.transaction(this.options.storeName, type)
    const store = transaction.objectStore(this.options.storeName)
    return { store, transaction }
  }

  handleSuccess = () => {
    this.db = this.open.result
    const { store } = this.transact()
    this.indexes = {}
    for (const { name } of this.options.indexes) {
      this.indexes[name] = store.index(name)
    }
  }

  put = object => {
    const { store } = this.transact()
    store.put(object)
  }

  get = search => {
    return new Promise((resolve, reject) => {
      const { store } = this.transact()
      const getter = store.get(search)
      getter.onsuccess = () => resolve(getter.result)
      getter.onerror = reject
    })
  };

  close = () => {
    this.db.close()
  }
}

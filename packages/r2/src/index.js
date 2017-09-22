import 'isomorphic-fetch'
import caseless from 'caseless'
import toTypedArray from 'typedarray-to-buffer'

const makeHeaders = obj => new Headers(obj)

const makeBody = value => {
  // TODO: Streams support.
  if (typeof value === 'string') {
    value = Buffer.from(value)
  }
  /* Can't test Blob types in Node.js */
  /* istanbul ignore else */
  if (Buffer.isBuffer(value)) {
    value = toTypedArray(value)
  }
  return value
}

const resolvable = () => {
  let _resolve
  let _reject
  let p = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  p.resolve = (...args) => _resolve(...args)
  p.reject = (...args) => _reject(...args)
  return p
}

class R2 {
  constructor(...args) {
    this.opts = { method: 'GET' }
    this.response = resolvable()
    this._headers = {}
    this._caseless = caseless(this._headers)

    let failSet = () => {
      throw new Error('Cannot set read-only property.')
    }
    Object.defineProperty(this, 'json', {
      get: () => this.response.then(resp => resp.clone().json()),
      set: failSet,
    })
    Object.defineProperty(this, 'text', {
      get: () => this.response.then(resp => resp.clone().text()),
      set: failSet,
    })
    Object.defineProperty(this, 'arrayBuffer', {
      get: () => this.response.then(resp => resp.clone().arrayBuffer()),
      set: failSet,
    })
    Object.defineProperty(this, 'blob', {
      get: () => this.response.then(resp => resp.clone().blob()),
      set: failSet,
    })
    Object.defineProperty(this, 'formData', {
      /* This isn't implemented in the shim yet */
      /* istanbul ignore next */
      get: () => this.response.then(resp => resp.clone().formData()),
      set: failSet,
    })

    this.defaults(...args)
  }
  defaults(uri = '', opts = {}) {
    this.defaultOpts = { uri, opts }
  }
  _args(...args) {
    const { defaultOpts } = this
    let opts = this.opts
    if (typeof args[0] === 'string') {
      const url = args.shift()
      opts.url = `${defaultOpts.uri}${url}`
    }
    if (typeof args[0] === 'object') {
      opts = Object.assign(opts, args.shift())
    }
    const headers = { ...defaultOpts.opts.headers, ...opts.headers }
    if (headers) {
      console.log('headers', headers)
      this.setHeaders(headers)
    }
    console.log('opts are', defaultOpts, opts)
    this.opts = opts
  }
  put(...args) {
    this.opts.method = 'PUT'
    this._args(...args)
    return this
  }
  get(...args) {
    this.opts.method = 'GET'
    this._args(...args)
    return this
  }
  post(...args) {
    this.opts.method = 'POST'
    this._args(...args)
    return this
  }
  head(...args) {
    this.opts.method = 'HEAD'
    this._args(...args)
    return this
  }
  patch(...args) {
    this.opts.method = 'PATCH'
    this._args(...args)
    return this
  }
  delete(...args) {
    this.opts.method = 'DELETE'
    this._args(...args)
    return this
  }
  _request() {
    let url = this.opts.url
    delete this.opts.url

    if (this.opts.json) {
      this.opts.body = JSON.stringify(this.opts.json)
      this.setHeader('content-type', 'application/json')
      delete this.opts.json
    }

    if (this.opts.body) {
      this.opts.body = makeBody(this.opts.body)
    }

    // TODO: formData API.

    this.opts.headers = makeHeaders(this._headers)

    fetch(url, this.opts)
      .then(resp => this.response.resolve(resp))
      .catch(err => this.response.reject(err))
  }
  setHeaders(obj) {
    for (let key in obj) {
      this._caseless.set(key, obj[key])
    }
    return this
  }
  setHeader(key, value) {
    let o = {}
    o[key] = value
    return this.setHeaders(o)
  }
}

export default (...args) => new R2(...args)
export const put = (...args) => new R2().put(...args)
export const get = (...args) => new R2().get(...args)
export const post = (...args) => new R2().post(...args)
export const head = (...args) => new R2().head(...args)
export const patch = (...args) => new R2().patch(...args)
export const del = (...args) => new R2().delete(...args)

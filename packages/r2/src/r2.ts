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
  // @ts-ignore
  p.resolve = (...args) => _resolve(...args)
  // @ts-ignore
  p.reject = (...args) => _reject(...args)
  return p
}

type R2Opts = {
  url?: string
  method: string
  formData?: Object
  headers?: Object
  query?: Object
  json?: Object
  body?: Object
}

class R2 {
  opts: R2Opts = { method: 'GET' }
  response = resolvable()
  _headers = {}
  _caseless = caseless(this._headers)

  // easy resolve to value type
  json: any
  text: any
  arrayBuffer: any
  blob: any
  formData: any

  constructor(...args) {
    let failSet = () => {
      throw new Error('Cannot set read-only property.')
    }
    Object.defineProperty(this, 'json', {
      // @ts-ignore
      get: () => this.response.then(resp => resp.clone().json()),
      set: failSet,
    })
    Object.defineProperty(this, 'text', {
      // @ts-ignore
      get: () => this.response.then(resp => resp.clone().text()),
      set: failSet,
    })
    Object.defineProperty(this, 'arrayBuffer', {
      // @ts-ignore
      get: () => this.response.then(resp => resp.clone().arrayBuffer()),
      set: failSet,
    })
    Object.defineProperty(this, 'blob', {
      // @ts-ignore
      get: () => this.response.then(resp => resp.clone().blob()),
      set: failSet,
    })
    Object.defineProperty(this, 'formData', {
      /* This isn't implemented in the shim yet */
      /* istanbul ignore next */
      // @ts-ignore
      get: () => this.response.then(resp => resp.clone().formData()),
      set: failSet,
    })

    this._args(...args)

    setTimeout(() => {
      this._request()
    }, 0)
  }
  _args(...args) {
    let opts = this.opts
    if (typeof args[0] === 'string') {
      opts.url = args.shift()
    }
    if (typeof args[0] === 'object') {
      opts = Object.assign(opts, args.shift())
    }
    // @ts-ignore
    if (opts.headers) {
      // @ts-ignore
      this.setHeaders(opts.headers)
    }
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
    const { formData, query, json, body } = this.opts
    let { url } = this.opts
    delete this.opts.url
    delete this.opts.query
    if (query && Object.keys(query).length) {
      const esc = encodeURIComponent
      const queryString = Object.keys(query)
        .map(k => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
        .join('&')
      url = url + `?${queryString}`
    }
    if (formData && Object.keys(formData).length) {
      const esc = encodeURIComponent
      const body = Object.keys(formData)
        .map(k => `${esc(k)}=${esc(formData[k])}`)
        .join('&')
      this.opts.body = body
    }
    if (json) {
      delete this.opts.json
      this.opts.body = JSON.stringify(json)
      this.setHeader('content-type', 'application/json')
    }
    if (body) {
      this.opts.body = makeBody(this.opts.body)
    }
    this.opts.headers = makeHeaders(this._headers)
    // @ts-ignore
    fetch(url, this.opts)
      // @ts-ignore
      .then(resp => this.response.resolve(resp))
      // @ts-ignore
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

export default function r2(...args) {
  return new R2(...args)
}

export const put = (...args) => new R2().put(...args)
export const get = (...args) => new R2().get(...args)
export const post = (...args) => new R2().post(...args)
export const head = (...args) => new R2().head(...args)
export const patch = (...args) => new R2().patch(...args)
export const del = (...args) => new R2().delete(...args)

r2['put'] = put
r2['get'] = get
r2['post'] = post
r2['head'] = head
r2['patch'] = patch
r2['del'] = del

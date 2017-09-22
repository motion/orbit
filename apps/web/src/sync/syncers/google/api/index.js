// from https://github.com/gadventures/gapi-js

import * as r2 from '@mcro/r2'
import GapiResources from './resources'

export default class Gapi extends GapiResources {
  constructor({ url = 'https://rest.gadventures.com', key, proxy }) {
    super()

    if (!key) {
      throw 'A gapi key is required when instantiating Gapi'
    }

    this.baseUrl = url
    this.key = key
    this.proxy = proxy
    this.queryParams = {}
    this.dupableParams = []
  }

  get _setParams() {
    this.rOpts = {
      params: new URLSearchParams(
        Object.entries({
          ...this.queryParams,
          ...this.dupableParams.reduce((o, [key, val]) => ({ [key]: val }), {}),
        })
      ),
      headers: new Headers({
        'X-Application-Key': this.key,
      }),
    }
    console.log('this.rOpts', this.rOpts)
    return this
  }

  _getUrl(...ids) {
    if (!this.resource) {
      throw 'No resource has been provided.' // TODO: Something more declarative.
    }
    const args = [this.baseUrl, this.resource, ...ids]
    return args.join('/') + '/'
  }

  get(ids) {
    const url = this._getUrl(ids)
    this.request = r2.get(url, this.rOpts)
    return this
  }

  list(start = 1, size = 20) {
    const url = this._getUrl()
    this.request = r2.get(url, this.rOpts)
    this.page(start, size)
    return this
  }

  query(queryObj) {
    this.queryParams = Object.assign({}, this.queryParams, queryObj)
    return this
  }

  page(number = 1, size = 20) {
    this.query({ page: number, max_per_page: size })
    return this
  }

  order(...rest) {
    rest.forEach(orderProp => {
      let thisOrderProp = orderProp
      const isDesc = orderProp.indexOf('-') === 0
      if (isDesc) {
        thisOrderProp = orderProp.slice(1)
      }
      if (thisOrderProp.length === 0) {
        throw new Error('Order parameter property is an empty string')
      }
      const queryParam = `order_by__${isDesc ? 'desc' : 'asc'}`
      this.dupableParams.push([queryParam, thisOrderProp])
    })
    return this
  }

  post() {
    const url = this._getUrl()
    this.request = r2.post(url)
    return this
  }

  patch(ids) {
    const url = this._getUrl(ids)
    this.request = r2.patch(url)
    return this
  }

  del(ids) {
    const url = this._getUrl(ids)
    this.request = r2.del(url)
    return this
  }

  send(args) {
    this.request.send(args)
    return this
  }

  end(callback) {
    this._setParams.r2.end(callback)
    return this
  }

  then(resolve, reject) {
    return this._setParams.r2.then(resolve, reject)
  }
}

// from https://github.com/gadventures/gapi-js

import request from 'r2'
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
    this.requestOpts = {
      json: {
        ...this.queryParams,
        ...this.dupableParams.reduce((o, [key, val]) => ({ [key]: val }), {}),
      },
      headers: {
        'X-Application-Key': this.key,
      },
    }
    console.log('this.requestOpts', this.requestOpts)
    return this
  }

  _getUrl(...ids) {
    /**
     *  Builds the full gapi request URL based on the resource provided
     *  `this.resource` is set by `GapiResource` getter methods.
    **/
    if (!this.resource) {
      throw 'No resource has been provided.' // TODO: Something more declarative.
    }
    const args = [this.baseUrl, this.resource, ...ids]
    return args.join('/') + '/'
  }

  get(ids) {
    /**
     * Support for multiple resource Ids
     * For resources that accept more than one id. e.g. `itineraries/123/456/`
    **/
    const url = this._getUrl(ids)
    this.request = request.get(url)
    return this
  }

  list(number = 1, size = 20) {
    /**
     *  By default will look for the first 20 items
    **/
    const url = this._getUrl()
    this.request = request.get(url)
    this.page(number, size)
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
    this.request = request.post(url)
    return this
  }

  patch(ids) {
    const url = this._getUrl(ids)
    this.request = request.patch(url)
    return this
  }

  del(ids) {
    const url = this._getUrl(ids)
    this.request = request.del(url)
    return this
  }

  send(args) {
    this.request.send(args)
    return this
  }

  end(callback) {
    this._setParams.request.end(callback)
    return this
  }

  then(resolve, reject) {
    return this._setParams.request.then(resolve, reject)
  }
}

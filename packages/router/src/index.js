import { observable, computed, action, autorun } from 'mobx'
import Router from './router'
import browserHistory from 'history/createBrowserHistory'

export Router from './router'

const properRoute = path => (path.indexOf('/') === 0 ? path : `/${path}`)

const LENGTH_KEY = 'router.historyLength'

const historyLength = 0 //Number(localStorage.getItem(LENGTH_KEY)) || 0
const historyDirection = val =>
  localStorage.setItem(
    LENGTH_KEY,
    Number(localStorage.getItem(LENGTH_KEY)) + val
  )

export class ObservableRouter {
  max = historyLength
  @observable position = historyLength
  @observable path = window.location.pathname
  @observable route = null
  @observable.ref params = {}
  @observable forceUpdate = false
  @observable version = 0

  _id = Math.random()

  constructor({ routes, history }) {
    this.routes = routes
    this.history = history || browserHistory()

    const routeHandlers = Object.keys(routes).reduce(
      (acc, path) => ({
        ...acc,
        [properRoute(path)]: params => this.setRoute(path, params),
      }),
      {}
    )

    this.router = new Router({
      routes: routeHandlers,
      history: this.history,
    })

    autorun(() => {
      if (this.path !== window.location.pathname || this.forceUpdate) {
        historyDirection(1)
        log && log('Router.go', this.path)
        this.history.push(this.path)
        this.forceUpdate = false
      }
    })
  }

  @action
  setRoute = (path, params) => {
    this.path = window.location.pathname
    this.route = path
    this.params = params || {}
  }

  @computed
  get key() {
    return `${this.version}${this.forceUpdate}${JSON.stringify(this.path)}`
  }

  @computed
  get activeView() {
    return this.routes[this.route]
  }

  @computed
  get routeName() {
    return this.path.split('/')[0]
  }

  @computed
  get atFront() {
    return this.position === this.max
  }

  @computed
  get atBack() {
    return this.position === 0
  }

  @action
  back = () => {
    historyDirection(-1)
    this.position -= 1
    this.history.goBack()
  }

  @action
  forward = () => {
    this.position += 1
    this.history.goForward()
  }

  @action
  go = (...segments) => {
    let path = segments.join('/')

    if (path.indexOf(window.location.origin) === 0) {
      path = path.replace(window.location.origin, '')
    } else {
      path = path[0] === '/' ? path : `/${path}`
    }
    if (path === this.path) {
      // avoid going to same url
      return
    }
    this.position += 1
    this.max = this.position
    this.path = path
  }

  // sets a part of the url
  @action
  set = (key, val) => {
    const Route = this.router.routeTable[`/${this.route}`]

    const params =
      typeof key === 'object' ? this.setObject(key) : this.setParam(key, val)

    const newPath = Route.stringify(params)

    if (newPath !== this.path) {
      this.path = newPath
    }
  };

  normalizeParams = (params: Object): Object => {
    // remove false/null
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === false || val === null) {
        delete params[key]
      }
    })
    return params
  }

  setObject = params => this.normalizeParams({ ...this.params, ...params })

  setParam = (key, val) => this.normalizeParams({ ...this.params, [key]: val })

  @action
  unset = key => {
    this.set(key, false)
  }

  @action
  redirect = path => {
    window.location.href = path
  }

  isActive = path => {
    return !!this.router.getMatch(path)
  }
}

export default ObservableRouter

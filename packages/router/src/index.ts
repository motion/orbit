import { observable, computed, action, autorun } from 'mobx'
import Router from './router'
import browserHistory from 'history/createBrowserHistory'

const properRoute = path => (path.indexOf('/') === 0 ? path : `/${path}`)
const LENGTH_KEY = 'router.historyLength'
const historyLength = 0 //Number(localStorage.getItem(LENGTH_KEY)) || 0
const historyDirection = val =>
  localStorage.setItem(
    LENGTH_KEY,
    Number(localStorage.getItem(LENGTH_KEY)) + val,
  )

type RouterProps = {
  routes: {
    [name: string]: any
  }
  history?: any
}

export class ObservableRouter {
  router: Router
  routes: any
  history: any

  max = historyLength
  @observable
  position = historyLength
  @observable
  path = window.location.pathname
  @observable
  route = null
  @observable.ref
  params = {}
  @observable
  forceUpdate = false
  @observable
  version = 0
  _id = Math.random()
  onNavigateCallback = null

  constructor({ routes, history }: RouterProps) {
    this.routes = routes
    this.history = history || browserHistory()
    const routeMap = {}
    for (const path in routes) {
      routeMap[properRoute(path)] = async params => {
        // support async routes
        if (routes[path] instanceof Promise) {
          console.log('await route')
          await routes[path]
        }
        this.setRoute(path, params)
      }
    }
    // setup router
    this.router = new Router({
      history: this.history,
      routes: routeMap,
    })
    // watch to update routes
    autorun(() => {
      if (this.path !== window.location.pathname || this.forceUpdate) {
        historyDirection(1)
        this.history.push(this.path)
        this.forceUpdate = false
        if (this.onNavigateCallback) {
          this.onNavigateCallback(this.path)
        }
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

  link = where => e => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    this.go(where || (e && e.target.href))
  }

  @action
  go = (...segments) => {
    let path = segments.join('/')
    if (path.indexOf(window.location.origin) === 0) {
      path = path.replace(window.location.origin, '')
    } else {
      if (path.indexOf('http') === 0) {
        // @ts-ignore
        window.location = path
        return
      }
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
  }

  @action
  onNavigate = callback => {
    this.onNavigateCallback = callback
  }

  normalizeParams = params => {
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
    return this.path === path
  }
}

export default ObservableRouter

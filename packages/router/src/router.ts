import Route from 'url-pattern'

export default class Router {
  routes: {}
  history: any
  routeTable: { [path: string]: Route }
  routeList: Array<{ path: string; route: Route }>

  constructor({ routes, history, path = window.location }) {
    this.routes = routes
    this.history = history

    // for quick lookups
    this.routeTable = Object.keys(this.routes).reduce(
      (acc, path) => ({
        ...acc,
        [path]: new Route(path),
      }),
      {},
    )

    // for easy looping
    this.routeList = Object.keys(this.routeTable).map(path => ({
      path,
      route: this.routeTable[path],
    }))

    this.history.listen(this.onRoute)
    this.onRoute(path)
  }

  onRoute = ({ pathname }) => {
    for (const { route, path } of this.routeList) {
      const match = route.match(pathname)
      if (match) {
        this.routes[path](match)
        break
      }
    }
  }

  getMatch = path => {
    for (const { route } of this.routeList) {
      const match = route.match(path)
      if (match) {
        return match
      }
    }
  }
}

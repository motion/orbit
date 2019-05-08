import { Action, Derive, run, Operator, mutate, pipe, debounce } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { paneManagerStore } from './stores'

export const urls = {
  home: '/',
  app: '/app/:id',
  appSub: '/app/:id/:subId',
}

type RouteName = keyof typeof urls
type Params = { [key: string]: string }

type HistoryItem = { name: RouteName; path: string; params?: Params }

export type RouterState = {
  history: HistoryItem[]
  pageName: string
  appId: string
  urlString: Derive<RouterState, string>
  isOnSetupApp: Derive<RouterState, boolean>
  lastPage: Derive<RouterState, HistoryItem>
  curPage: Derive<RouterState, HistoryItem>
  ignoreNextPush: boolean
}

// helpers

const replaceParam = (a: string, p: Params) => p[a.slice(1)] || a

const getPath = (name: string, p?: Params) => {
  return !p
    ? urls[name]
    : urls[name]
        .split('/')
        .reduce((a, ps) => `${a}/${replaceParam(ps, p)}`, '')
        .slice(1)
}

const getItem = (name: RouteName, params?: Params): HistoryItem => ({
  name,
  path: getPath(name, params),
  params,
})

// init

// state

export const state: RouterState = {
  history: [],
  pageName: 'home',
  appId: 'search',
  ignoreNextPush: false,
  isOnSetupApp: state => state.pageName === 'app' && state.appId === 'setupApp',
  lastPage: state => state.history[state.history.length - 2],
  curPage: state => state.history[state.history.length - 1],
  urlString: state => (state.curPage ? `orbit:/${state.curPage.path}` : ''),
}

const showPage: Operator<HistoryItem> = pipe(
  mutate((om, item) => {
    om.state.router.pageName = item.name
    om.state.router.history = [...om.state.router.history, item]
  }),
  run((om, item) => {
    if (!om.state.router.ignoreNextPush) {
      om.effects.router.open(item.path)
    }
  }),
  mutate(om => {
    om.state.router.ignoreNextPush = false
  }),
  debounce(250),
  mutate(om => {
    om.state.navVisible = false
  }),
)

const showHomePage: Action = om => {
  om.actions.router.showPage(getItem('home'))
  om.effects.router.setPane(`${om.state.apps.apps.find(x => x.identifier === 'search').id}`)
}

const showAppPage: Action<{ id?: string; subId?: string }> = (om, params) => {
  om.actions.router.showPage(getItem('app', params))
  om.state.router.appId = params.id
  om.effects.router.setPane(params.id)
}

const showSetupAppPage: Action = om => {
  om.actions.router.showAppPage({ id: 'setupApp' })
}

const toggleSetupAppPage: Action = om => {
  if (om.state.router.isOnSetupApp) {
    console.log('TODO')
    // om.actions.router.showAppPage(om.state.router.lastPage)
  } else {
    om.actions.router.showSetupAppPage()
  }
}

const ignoreNextPush: Action = om => {
  om.state.router.ignoreNextPush = true
}

const back: Action = om => {
  if (om.state.router.history.length > 1) {
    showPage(om, om.state.router.lastPage)
  }
}

export const actions = {
  showPage,
  showAppPage,
  showHomePage,
  showSetupAppPage,
  toggleSetupAppPage,
  ignoreNextPush,
  back,
}

// effects

export const effects = {
  routeListenNotFound() {
    page('*', ctx => {
      console.log('Not found!', ctx)
    })
  },

  routeListen(route, actions, pageAction) {
    page(route, ({ params, querystring }) => {
      console.log('got a route', route)
      actions.router.ignoreNextPush()
      pageAction({
        ...params,
        ...queryString.parse(querystring),
      })
    })
  },

  start: () => {
    page.start()
  },

  open(url: string) {
    console.log('show', url)
    page.show(url)
  },

  setPane(appId: string) {
    paneManagerStore.setActivePane(appId)
  },
}

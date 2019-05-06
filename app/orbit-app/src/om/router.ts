import { Action, Derive } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { defaultPanes } from '../effects/paneManagerStoreUpdatePanes'
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
  path: getPath(name, p),
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

// actions

const showPage: Action<HistoryItem> = (om, item) => {
  om.state.router.pageName = item.name
  om.state.router.history = [...om.state.router.history, item]
  if (!om.state.router.ignoreNextPush) {
    om.effects.router.open(item.path)
  }
  om.state.router.ignoreNextPush = false
}

const showHomePage: Action = om => {
  showPage(om, getItem('home'))
  om.effects.router.setHomePane()
}

const showAppPage: Action<{ id?: string; subId?: string }> = (om, params) => {
  showPage(om, getItem('app', params))
  om.state.router.appId = params.id
  om.effects.router.setPane(params.id)
}

const showSetupAppPage: Action = om => {
  showAppPage(om, { id: 'setupApp' })
}

const toggleSetupAppPage: Action = om => {
  if (om.state.router.isOnSetupApp) {
    showPage(om, om.state.router.lastPage)
  } else {
    showSetupAppPage(om)
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

const start: Action = om => {
  paneManagerStore.setPaneIndex(defaultPanes.length)
  om.effects.router.start()
}

export const actions = {
  showPage,
  showAppPage,
  showHomePage,
  showSetupAppPage,
  toggleSetupAppPage,
  ignoreNextPush,
  back,
  start,
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
    page.show(url)
  },

  setPane(appId: string) {
    paneManagerStore.setActivePane(appId)
  },

  setHomePane() {
    paneManagerStore.setActivePane(paneManagerStore.homePane.id)
  },
}

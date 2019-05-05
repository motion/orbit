import { Action, Derive } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { paneManagerStore } from './stores'
import { defaultPanes } from '../effects/paneManagerStoreUpdatePanes'

export const urls = {
  home: '/',
  app: '/app/:id',
}

type RouteName = keyof typeof urls
type Params = { [key: string]: string }

type HistoryItem = { name: RouteName; path: string }

export type RouterState = {
  history: HistoryItem[]
  currentPage: string
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

const getItem = (name: RouteName, p?: Params) => ({
  name,
  path: getPath(name, p),
})

// init

// state

export const state: RouterState = {
  history: [],
  currentPage: 'home',
  appId: 'search',
  ignoreNextPush: false,
  isOnSetupApp: state => state.currentPage === 'app' && state.appId === 'setupApp',
  lastPage: state => state.history[state.history.length - 2],
  curPage: state => state.history[state.history.length - 1],
  urlString: state => `app://${state.curPage.path}`,
}

// actions

const showPage: Action<HistoryItem> = (om, item) => {
  om.state.router.currentPage = item.name
  om.state.router.history = [...om.state.router.history, item]
  if (!om.state.router.ignoreNextPush) {
    om.effects.router.open(item.path)
  }
  om.state.router.ignoreNextPush = false
}

const showHomePage: Action = om => {
  showPage(om, getItem('home'))
}

const showAppPage: Action<string> = (om, id) => {
  showPage(om, getItem('app', { id }))
  om.state.router.appId = id
  om.effects.router.setPane(id)
}

const showSetupAppPage: Action = om => {
  showAppPage(om, 'setupApp')
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
    om.actions.router.showPage(om.state.router.lastPage)
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
  routeListen(route, actions, pageAction) {
    page(route, ({ params, querystring }) => {
      actions.router.ignoreNextPush()
      pageAction({
        ...params,
        ...queryString.parse(querystring),
      })
    })
  },

  start: () => page.start(),

  open(url: string) {
    page.show(url)
  },

  setPane(appId) {
    paneManagerStore.setActivePane(appId)
  },
}

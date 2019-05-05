import { Action, Derive, OnInitialize } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { paneManagerStore } from './stores'

const urls = {
  home: '/',
  app: '/app/:id',
}

type RouteName = keyof typeof urls
type Params = { [key: string]: string }

type HistoryItem = { name: RouteName; path: string }

type State = {
  history: HistoryItem[]
  currentPage: string
  appId: string
  isOnSetupApp: Derive<State, boolean>
  lastPage: Derive<State, HistoryItem>
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

export const onInitialize: OnInitialize = ({ actions, effects }) => {
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, ({ id }) => actions.router.showAppPage(id))
}

// state

export const state: State = {
  history: [],
  currentPage: 'home',
  appId: 'search',
  isOnSetupApp: state => state.currentPage === 'app' && state.appId === 'setupApp',
  lastPage: state => state.history[state.history.length - 1],
  ignoreNextPush: false,
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

export const actions = {
  showPage,
  showAppPage,
  showHomePage,
  showSetupAppPage,
  toggleSetupAppPage,
  ignoreNextPush,
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

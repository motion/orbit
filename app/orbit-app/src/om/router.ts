import { Action, catchError, Derive, mutate, Operator, pipe, run } from 'overmind'
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
  historyIndex: number
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
  historyIndex: -1,
  history: [],
  pageName: 'home',
  appId: 'search',
  ignoreNextPush: false,
  isOnSetupApp: state => state.pageName === 'app' && state.appId === 'setupApp',
  lastPage: state => state.history[state.history.length - 2],
  curPage: state => state.history[state.history.length - 1],
  urlString: state => (state.curPage ? `orbit:/${state.curPage.path}` : ''),
}

class AlreadyOnPageError extends Error {}

const showPage: Operator<HistoryItem> = pipe(
  mutate((om, item) => {
    const alreadyOnPage = JSON.stringify(item) === JSON.stringify(om.state.router.curPage)
    if (alreadyOnPage) {
      throw new AlreadyOnPageError()
    }
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
  catchError((_, error) => {
    if (error instanceof AlreadyOnPageError) {
      return
    } else {
      console.error(error)
    }
  }),
)

const showHomePage: Action = om => {
  om.actions.router.showPage(getItem('home'))
  const foundApp = om.state.apps.activeApps.find(x => x.identifier === 'home')
  if (foundApp) {
    om.state.router.appId = `${foundApp.id}`
    om.effects.router.setPane(om.state.router.appId)
  }
}

const isNumString = (x: number | string) => +x == x

const showAppPage: Action<{ id?: string; subId?: string }> = (om, params) => {
  // find by identifier optionally
  console.log('what', isNumString(params.id), params.id, om.state.apps.activeApps)
  const id = isNumString(params.id)
    ? params.id
    : `${om.state.apps.activeApps.find(x => x.identifier === params.id).id}`
  const next = {
    ...params,
    id,
  }
  om.actions.router.showPage(getItem('app', next))
  om.state.router.appId = next.id
  om.effects.router.setPane(next.id)
}

const showSetupAppPage: Action = om => {
  om.actions.router.showAppPage({ id: 'setupApp' })
}

const toggleSetupAppPage: Action = om => {
  if (om.state.router.isOnSetupApp) {
    om.actions.router.back()
  } else {
    om.actions.router.showSetupAppPage()
  }
}

const ignoreNextPush: Action = om => {
  om.state.router.ignoreNextPush = true
}

const back: Action = om => {
  if (om.state.router.historyIndex > -1) {
    om.state.router.historyIndex--
    window.history.back()
  }
}

const forward: Action = om => {
  if (om.state.router.historyIndex < om.state.router.history.length - 1) {
    om.state.router.historyIndex++
    window.history.forward()
  }
}

const routeListen: Action<{ url: string; action: 'showHomePage' | 'showAppPage' }> = (
  om,
  { action, url },
) => {
  page(url, ({ params, querystring }) => {
    om.actions.router.ignoreNextPush()
    om.actions.router[action]({
      ...params,
      ...queryString.parse(querystring),
    })
  })
}

const routeListenNotFound: Action = () => {
  page('*', ctx => {
    console.log('Not found!', ctx)
  })
}

export const actions = {
  routeListenNotFound,
  routeListen,
  showPage,
  showAppPage,
  showHomePage,
  showSetupAppPage,
  toggleSetupAppPage,
  ignoreNextPush,
  back,
  forward,
}

// effects

export const effects = {
  start: () => {
    page.start()
  },

  open(url: string) {
    page.show(url)
  },

  setPane(appId: string) {
    paneManagerStore.setPane(appId)
  },
}

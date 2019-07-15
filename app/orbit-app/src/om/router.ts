import { getAppDefinition } from '@o/kit'
import { Action, catchError, Derive, mutate, Operator, pipe, run } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarousel'
import { headerStore } from '../pages/OrbitPage/OrbitHeader'
import { paneManagerStore } from './stores'

export const urls = {
  home: '/',
  app: '/app/:id',
  appSub: '/app/:id/:subId',
}

type RouteName = keyof typeof urls
type Params = {
  [key: string]: string | number | boolean | undefined
}

type HistoryItem = {
  name: RouteName
  path: string
  params?: Params
  replace?: boolean
}

export type RouterState = {
  historyIndex: number
  history: HistoryItem[]
  pageName: string
  appId: string
  appIdentifier: Derive<RouterState, string>
  urlString: Derive<RouterState, string>
  isOnSetupApp: Derive<RouterState, boolean>
  isOnQuickFind: Derive<RouterState, boolean>
  isOnDockedApp: Derive<RouterState, boolean>
  lastPage: Derive<RouterState, HistoryItem | undefined>
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

const getItem = (name: RouteName, params?: Params, replace?: boolean): HistoryItem => ({
  name,
  path: getPath(name, params),
  params,
  replace,
})

// init

// state

export const state: RouterState = {
  historyIndex: -1,
  history: [],
  pageName: 'home',
  appId: 'search',
  ignoreNextPush: false,
  lastPage: state => state.history[state.history.length - 2],
  curPage: state => state.history[state.history.length - 1],
  appIdentifier: state =>
    (state.pageName === 'app' && `${state.curPage.params!.identifier!}`) || '',
  isOnSetupApp: state => state.pageName === 'app' && state.appIdentifier === 'setupApp',
  isOnQuickFind: state => state.pageName === 'app' && state.appIdentifier === 'quickFind',
  isOnDockedApp: (state, globalState) =>
    globalState.apps.activeDockApps.some(x => `${x.id}` === state.appId),
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
    if (!item.replace) {
      om.state.router.historyIndex++
    }
  }),
  run((om, item) => {
    if (!om.state.router.ignoreNextPush) {
      if (item.replace) {
        om.effects.router.replace(item.path)
      } else {
        om.effects.router.open(item.path)
      }
    }
  }),
  mutate(om => {
    om.state.router.ignoreNextPush = false
  }),
  catchError<void>((_, error) => {
    if (error instanceof AlreadyOnPageError) {
      // ok
    } else {
      console.error(error)
    }
  }),
)

const getFirstApp = om => {
  return om.state.apps.activeApps.find(
    x => x.tabDisplay !== 'hidden' && !!getAppDefinition(x.identifier!).app,
  )
}

const showHomePage: Action<{ avoidScroll?: boolean; avoidZoom?: boolean } | undefined> = (
  om,
  item,
) => {
  const firstApp = getFirstApp(om)
  if (firstApp) {
    const id = `${firstApp.id}`
    if (item && item.avoidZoom) {
      om.actions.router.showPage(getItem('home'))
      om.effects.router.setPane(id, item)
    } else {
      om.actions.router.showPage(getItem('app', { id: firstApp.identifier! }))
      om.state.router.appId = id
      om.effects.router.setPane(id, item)
    }
  } else {
    console.log('no home app found')
  }
}

const showAppPage: Action<{
  id?: string
  subId?: string
  replace?: boolean
  toggle?: boolean | 'docked'
}> = (om, params) => {
  const app = om.state.apps.activeApps.find(
    x =>
      // find by identifier optionally
      x.identifier! === params.id! || x.id === +params.id!,
  )

  if (app === getFirstApp(om)) {
    return om.actions.router.showHomePage({ avoidScroll: !!params.replace })
  }

  if (!app) {
    throw new Error(`No app found ${params.id}`)
  }

  const id = isNumString(params.id || 'not') ? params.id! : app ? `${app.id}` : ''

  // toggle back to last page
  if (params.toggle && om.state.router.appId === id) {
    if (params.toggle === 'docked' && om.state.router.isOnDockedApp) {
      om.actions.router.closeDrawer()
    } else {
      om.actions.router.back()
    }
    return
  }

  const next = {
    ...params,
    identifier: app.identifier,
    id,
  }
  om.actions.router.showPage(getItem('app', next, params.replace))
  om.state.router.appId = id
  om.effects.router.setPane(id, { avoidScroll: !!params.replace })
}

const showQuickFind: Action = om => {
  om.actions.router.showAppPage({ id: 'quickFind' })
}

const toggleQuickFind: Action = om => {
  if (om.state.router.isOnQuickFind) {
    om.actions.router.closeDrawer()
  } else {
    om.actions.router.showAppPage({ id: 'quickFind' })
  }
}

const isNumString = (x: number | string) => +x == x

const closeDrawer: Action = om => {
  if (om.state.apps.lastActiveApp) {
    om.actions.router.showAppPage({ id: `${om.state.apps.lastActiveApp.id}` })
  }
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
  if (om.state.router.historyIndex > 0) {
    // subtract two because back will add one!
    om.state.router.historyIndex -= 2
    window.history.back()
  }
}

const forward: Action = om => {
  if (om.state.router.historyIndex < om.state.router.history.length - 1) {
    // subtract two because forward will add one!
    om.state.router.historyIndex += 2
    window.history.forward()
  }
}

let ignoreNextRoute = false

const routeListen: Action<{ url: string; action: 'showHomePage' | 'showAppPage' }> = (
  om,
  { action, url },
) => {
  page(url, ({ params, querystring }) => {
    if (ignoreNextRoute) {
      ignoreNextRoute = false
      return
    }
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
  showQuickFind,
  toggleQuickFind,
  closeDrawer,
}

// effects

export const effects = {
  watchPage() {
    if (window.location.pathname === '/') {
      ignoreNextRoute = true
    }
    page.start()
  },

  open(url: string) {
    ignoreNextRoute = true
    page.show(url)
  },

  replace(url: string) {
    ignoreNextRoute = true
    page.replace(url)
  },

  setPane(appId: string, opts: { avoidScroll?: boolean; avoidZoom?: boolean } = {}) {
    paneManagerStore.setPane(appId)
    // scroll to pane if its in carousel
    if (!opts.avoidScroll) {
      const index = appsCarouselStore.apps.findIndex(app => app.id === +appId)
      if (index >= 0) {
        console.log('avoid zoom>', opts)
        appsCarouselStore.scrollToIndex(index, !opts.avoidZoom)
      }
    }
    // focus input after page navigate
    headerStore.focus()
  },
}

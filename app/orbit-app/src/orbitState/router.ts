import page from 'page'
import queryString from 'query-string'

export const state = {
  currentPage: 'home',
  appId: 'search',
}

export const onInitialize = ({ actions, effects }) => {
  effects.router.route('/', actions.showHomePage)
  effects.router.route('/app/:id', actions.showAppPage)
}

export const actions = {
  showHomePage({ state }) {
    state.router.currentPage = 'home'
  },
  showAppPage({ value, state }) {
    state.router.currentPage = 'app'
    state.router.appId = value.id
  },
}

export const effects = {
  route(route, action) {
    page(route, ({ params, querystring }) => {
      const payload = {
        ...params,
        ...queryString.parse(querystring),
      }
      action(payload)
    })
  },
  start: () => page.start(),
  open: url => page.show(url),
}

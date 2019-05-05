import { OnInitialize } from 'overmind'

import { urls } from './router'

export const onInitialize: OnInitialize = ({ actions, effects }) => {
  effects.router.routeListen(urls.home, actions, actions.router.showHomePage)
  effects.router.routeListen(urls.app, actions, ({ id }) => actions.router.showAppPage(id))
}

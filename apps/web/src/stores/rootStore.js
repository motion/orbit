// @flow
import Router from '~/router'
import { OS } from '~/helpers'
import * as Constants from '~/constants'

export default class RootStore {
  showBrowse = false

  willMount() {
    // listen to Ionize
    if (Constants.APP_KEY) {
      OS.on('app-goto', (event, arg) => {
        console.log('appgoto', arg)
        Router.go(arg)
      })
      OS.send('where-to', Constants.APP_KEY)
    }
  }

  actions = {
    cmdR: () => {
      window.location.href = window.location.href
    },
    toggleSidebar: () => {
      OS.send('app-bar-toggle', Constants.APP_KEY)
    },
  }
}

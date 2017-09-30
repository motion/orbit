// @flow
import Router from '~/router'
import { OS } from '~/helpers'
import * as Constants from '~/constants'

export const SHORTCUTS = {
  left: 'left',
  right: 'right',
  down: 'down',
  up: 'up',
  j: 'j', // down
  k: 'k', // up
  d: 'd', // doc
  enter: 'enter',
  esc: 'esc',
  explorer: ['command+t'],
  cmdA: 'command+a',
  cmdL: 'command+l',
  cmdEnter: 'command+enter',
  cmdUp: 'command+up',
  cmdR: 'command+r',
  delete: ['delete', 'backspace'],
  togglePane: 'shift+tab',
  fullscreen: ['command+b', 'command+\\'],
}

export default class RootStore {
  showBrowse = false

  start() {
    // listen to Ionize
    if (Constants.APP_KEY) {
      OS.on('app-goto', (event, arg) => {
        console.log('appgoto', arg)
        Router.go(arg)
      })
      OS.send('where-to', Constants.APP_KEY)
    }
  }

  shortcuts = SHORTCUTS

  actions = {
    cmdR: () => {
      window.location.href = window.location.href
    },
    toggleSidebar: () => {
      OS.send('app-bar-toggle', Constants.APP_KEY)
    },
  }
}

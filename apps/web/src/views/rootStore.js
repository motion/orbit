// @flow
import { watch } from '@mcro/black'
import { User, Thing } from '~/app'
import Router from '~/router'
import { OS } from '~/helpers'

const SHORTCUTS = {
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
  toggleSidebar: 'command+\\',
  togglePane: 'shift+tab',
}

export default class RootStore {
  showBrowse = false

  @watch
  document = () => {
    if (Router.path === '/') {
      return User.home
    }
    if (Router.params.id) {
      return Thing.get(Router.params.id)
    }
  }

  @watch
  crumbs = [
    () => this.document && this.document.id,
    () => this.document && this.document.getCrumbs(),
  ]

  @watch
  children = [
    () => [this.document && this.document.id, this.showBrowse],
    () => this.document && this.document.getChildren({ depth: Infinity }),
  ]

  shortcuts = SHORTCUTS

  actions = {
    cmdR: () => {
      window.location.href = window.location.href
    },
    toggleTitlebar: () => {
      OS.send('app-bar-toggle')
    },
  }
}

// @flow

import { isNumber, includes, find, debounce } from 'lodash'
import { actionToKeyCode } from './helpers'
import { SHORTCUTS } from '~/stores/rootStore'
import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import * as PaneTypes from './panes'
import { MillerState } from './miller'

const actions = [
  'remind',
  'send',
  'attach',
  'discuss',
  'assign',
  'update',
  'new',
  'calendar',
  'busy',
  'free',
  'wait',
  'ping',
  'everyone',
  'open',
  'close',
  'forward',
  'notifications',
  'issues',
  'docs',
].sort()

export default class BarStore {
  millerStateVersion = 0
  inputRef: ?HTMLElement = null
  metaKey = false
  activeAction = null

  millerStore = null
  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''

  _millerState = null
  setMillerState = val => {
    this._millerState = val
  }

  get millerState() {
    return this._millerState
    // return this.millerState
  }

  // check if it's a textbox in a pane so we can not close bar
  isTextbox = ({ target }) =>
    target.className !== this.inputRef.className &&
    includes(['input', 'textarea'], target.tagName.toLowerCase())

  start() {
    this.on(window, 'focus', this.focusBar)
    this.attachTrap('window', window)
    this.react(
      () => {
        this.activeCol
      },
      () => {
        this.activeAction = null
      }
    )

    /*
    this.millerState.onChangeColumn((col, lastCol) => {
      if (lastCol !== 0 && col === 0) {
        this.focusBar()
      }

      if (lastCol === 0 && col !== 0) {
        this.blurBar()
      }
    })
    */

    document.addEventListener('keydown', e => {
      this.metaKey = e.metaKey

      if (this.metaKey && !this.isTextbox(e)) {
        ;(this.allActions() || []).forEach(action => {
          if (actionToKeyCode(action) === e.keyCode) {
            e.preventDefault()
            this.activeAction = action
            console.log('executing action', action)
          }
        })
      }
    })
    document.addEventListener('keyup', e => {
      this.metaKey = e.metaKey
    })

    this.watch(() => {
      if (this.millerStore) {
        this.millerStore.setPaneProps({
          search: this.search,
        })
      }
    })
  }

  runAction = name => {
    if (this.activeAction && this.activeAction.name === name) {
      this.activeAction = null
    } else {
      this.activeAction =
        find(this.allActions(), action => action.name === name) || null
    }
  }

  allActions() {
    const { activeItem, paneActions } = this.millerState
    return [
      ...(paneActions || []),
      ...((activeItem && activeItem.actions) || []),
    ]
  }

  toolbarActions() {
    const { activeItem } = this.millerState
    return (activeItem && activeItem.actions) || []
  }

  attachTrap = (name, el) => {
    const _name = `${name}Trap`
    this[_name] = new Mousetrap(el)
    for (const name of Object.keys(SHORTCUTS)) {
      if (this.actions[name]) {
        const chord = SHORTCUTS[name]
        this[_name].bind(chord, this.actions[name])
      }
    }
  }

  get showTextbox() {
    return this.millerState.activeCol === 0
  }

  onInputRef = el => {
    this.inputRef = el
    this.attachTrap('bar', el)
  }

  focusBar = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
    }
  }

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
  }

  setSearch = debounce(text => {
    this.search = text
    setTimeout(() => {
      this.millerState.setActiveRow(0)
    })
  }, 150)

  onSearchChange = e => {
    this.textboxVal = e.target.value
    this.setSearch(this.textboxVal)
  }

  get peekItem() {
    if (!this.search) {
      return ''
    }
    return actions[
      actions.findIndex(action => action.indexOf(this.search) === 0)
    ]
  }

  PANE_TYPES = {
    main: PaneTypes.Main,
    message: PaneTypes.Message,
    setup: PaneTypes.Setup,
    inbox: PaneTypes.Threads,
    browse: PaneTypes.Browse,
    feed: PaneTypes.Feed,
    notifications: PaneTypes.Notifications,
    login: PaneTypes.Login,
    issue: PaneTypes.Task,
    orbit: PaneTypes.Orbit,
    task: PaneTypes.Task,
    doc: PaneTypes.Doc,
    test: PaneTypes.Test,
    newIssue: PaneTypes.Code.NewIssue,
    integrations: PaneTypes.Integrations,
    team: PaneTypes.Team,
  }

  get isBarActive() {
    return this.inputRef === document.activeElement
  }

  get hasSelectedItem() {
    return isNumber(this.millerState.activeRow)
  }

  // call these to send key to miller
  millerKeyActions = {}
  actions = {
    down: e => {
      this.millerKeyActions.down()
      e.preventDefault()
    },
    up: e => {
      if (this.millerState.activeRow > 0) {
        this.millerKeyActions.up()
      }

      e.preventDefault()
    },
    esc: e => {
      if (this.isTextbox(e)) return
      if (this.activeAction) {
        this.activeAction = null
        return
      }
      e.preventDefault()
      if (this.search !== '') {
        this.search = ''
        this.textboxVal = ''
      } else {
        OS.send('bar-hide')
      }
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: e => {
      e.preventDefault()
      const { currentItem } = this.millerState

      if (currentItem.static) {
        console.log('static item, no action')
        return
      }

      if (currentItem.onSelect) {
        currentItem.onSelect()
      } else {
        const schema = JSON.stringify(currentItem)
        OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
      }
    },
    right: e => {
      if (this.hasSelectedItem) {
        this.millerKeyActions.right()
        e.preventDefault()
      } else {
        if (this.peekItem) this.search = this.peekItem
      }
    },
    left: e => {
      if (this.hasSelectedItem) {
        this.millerKeyActions.left()
        e.preventDefault()
      }
    },
  }
}

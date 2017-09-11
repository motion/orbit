// @flow
import * as React from 'react'
import Mousetrap from 'mousetrap'
import { view } from '@mcro/black'
import { OS } from '~/helpers'
import * as UI from '@mcro/ui'
import * as PaneTypes from './panes'
import Actions from './panes/pane/actions'
import { MillerState, Miller } from './miller'
import { isNumber, includes, find, debounce } from 'lodash'
import { actionToKeyCode } from './helpers'
import Pane from '~/views/pane'
import { SHORTCUTS } from '~/stores/rootStore'

const PANE_TYPES = {
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

@view.ui
class BottomActions {
  render({ actions, metaKey }) {
    return (
      <bar $$draggable>
        <section>
          <UI.Text $label>Team: Motion</UI.Text>
        </section>
        <section>
          <UI.Text $label>⌘ Actions</UI.Text>
          <Actions metaKey={metaKey} actions={actions} />
        </section>
      </bar>
    )
  }

  static style = {
    bar: {
      justifyContent: 'space-between',
      flexFlow: 'row',
      height: 32,
      alignItems: 'center',
      padding: [0, 10],
      // background: [255, 255, 255, 0.1],
      borderTop: [1, [0, 0, 0, 0.1]],
    },
    section: {
      flexFlow: 'row',
    },
    label: {
      marginRight: 0,
      opacity: 0.5,
    },
  }
}

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

class BarStore {
  millerState = MillerState.serialize([{ type: 'main', data: { prefix: '' } }])
  millerStateVersion = 0
  inputRef: ?HTMLElement = null
  metaKey = false
  activeAction = null

  // search is throttled, textboxVal isn't
  millerStore = null
  search = ''
  textboxVal = ''

  // check if it's a textbox in a pane so we can not close bar
  isTextbox = ({ target }) =>
    this.inputRef &&
    target.className !== this.inputRef.className &&
    includes(['input', 'textarea'], target.tagName.toLowerCase())

  start() {
    this.on(window, 'focus', this.focusBar)
    this.attachTrap('window', window)
    this.millerState.onSelectionChange(() => {
      this.activeAction = null
    })

    this.millerState.onChangeColumn((col, lastCol) => {
      if (lastCol !== 0 && col === 0) {
        this.focusBar()
      }

      if (lastCol === 0 && col !== 0) {
        this.blurBar()
      }
    })

    this.watch(() => {
      if (this.millerStore) {
        this.millerStore.setPaneProps({
          search: this.search,
        })
      }
    })

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

  onMillerStateChange = state => {
    this.millerState = state
    this.millerStateVersion++
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
      // allows one frame of interception (by pane store)
      setTimeout(() => {
        if (window.preventEscClose !== true) {
          e.preventDefault()
          if (this.search !== '') {
            this.search = ''
            this.textboxVal = ''
          } else {
            OS.send('bar-hide')
          }
        }
        window.preventEscClose = false
      }, 50)
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

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 32,
}

@view.provide({ barStore: BarStore })
@view
export default class BarPage {
  render({ barStore: store }) {
    return (
      <UI.Theme name="clear-dark">
        <bar ref={store.ref('barRef').set} $$fullscreen>
          <header css={{ borderBottom: [1, [0, 0, 0, 0.1]] }} $$draggable>
            <UI.Input
              size={2.2}
              getRef={store.onInputRef}
              borderRadius={5}
              onChange={store.onSearchChange}
              value={store.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={{
                padding: [0, 20],
                ...inputStyle,
              }}
            />
            <forwardcomplete>{store.peekItem}</forwardcomplete>
            <pasteicon if={false}>
              <UI.Icon size={50} type="detailed" name="paper" />
            </pasteicon>
          </header>
          <Miller
            getRef={store.ref('millerStore').set}
            version={store.millerStateVersion}
            state={store.millerState}
            panes={PANE_TYPES}
            onChange={store.onMillerStateChange}
            pane={Pane}
            onKeyActions={store.ref('millerKeyActions').set}
          />
          <UI.Popover
            if={store.activeAction}
            open={true}
            onClose={() => {
              store.activeAction = null
            }}
            borderRadius={5}
            elevation={3}
            target={`.target-${store.activeAction.name}`}
            overlay="transparent"
            distance={8}
          >
            {store.activeAction.popover}
          </UI.Popover>

          <BottomActions
            metaKey={store.metaKey}
            actions={store.toolbarActions()}
          />
        </bar>
      </UI.Theme>
    )
  }

  static style = {
    bar: {
      background: [150, 150, 150, 0.65],
      flex: 1,
    },
    results: {
      borderTop: [1, 'dotted', [0, 0, 0, 0.1]],
      flex: 2,
      flexFlow: 'row',
      transition: 'transform 80ms linear',
      transform: {
        z: 0,
        x: 0,
      },
    },
    pasteicon: {
      position: 'absolute',
      top: -30,
      right: -20,
      width: 128,
      height: 128,
    },
    forwardcomplete: {
      position: 'absolute',
      top: 25,
      left: 20,
      opacity: 0.3,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
  }
}

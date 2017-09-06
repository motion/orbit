// @flow
import * as React from 'react'
import Mousetrap from 'mousetrap'
import ReactDOM from 'react-dom'
import { view } from '@mcro/black'
import { OS } from '~/helpers'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { MillerState, Miller } from './miller'
import { isNumber, debounce } from 'lodash'
import { SHORTCUTS } from '~/stores/rootStore'

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

  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''

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

  start() {
    this.on(window, 'focus', this.focusBar)
    this.attachTrap('window', window)
    this.millerState.onChangeColumn((col, lastCol) => {
      if (lastCol !== 0 && col === 0) {
        this.focusBar()
      }

      if (lastCol === 0 && col !== 0) {
        this.blurBar()
      }
    })
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
    this.millerStateVersion++
  }

  PANE_TYPES = {
    main: Panes.Main,
    message: Panes.Message,
    setup: Panes.Setup,
    inbox: Panes.Threads,
    browse: Panes.Browse,
    feed: Panes.Feed,
    notifications: Panes.Notifications,
    login: Panes.Login,
    'code.issue': Panes.Code.Issue,
    orbit: Panes.Orbit,
    task: Panes.Task,
    doc: Panes.Doc,
    test: Panes.Test,
    newIssue: Panes.Code.NewIssue,
    integrations: Panes.Integrations,
    team: Panes.Team,
  }

  get isBarActive() {
    return this.inputRef === document.activeElement
  }

  get hasSelectedItem() {
    return isNumber(this.millerState.activeRow)
  }

  // call these to send key to miller
  millerActions = {}
  actions = {
    down: e => {
      this.millerActions.down()
      e.preventDefault()
    },
    up: e => {
      console.log('up')
      if (this.millerState.activeRow > 0) {
        this.millerActions.up()
      }

      e.preventDefault()
    },
    esc: e => {
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
        this.millerActions.right()
        e.preventDefault()
      } else {
        if (this.peekItem) this.search = this.peekItem
      }
    },
    left: e => {
      if (this.hasSelectedItem) {
        this.millerActions.left()
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

@view({
  store: BarStore,
})
export default class BarPage {
  render({ store }) {
    const paneProps = {
      itemProps: {
        size: 1.2,
        glow: false,
        hoverable: true,
        fontSize: 26,
        padding: [0, 10],
        height: 40,
        highlightBackground: [0, 0, 0, 0.15],
        highlightColor: [255, 255, 255, 1],
      },
    }

    return (
      <UI.Theme name="clear-dark">
        <bar ref={store.ref('barRef').set} $$fullscreen $$draggable>
          <div>
            <UI.Input
              size={2.6}
              getRef={store.onInputRef}
              borderRadius={5}
              onChange={store.onSearchChange}
              value={store.textboxVal}
              borderWidth={0}
              css={{
                margin: [-2, 0, 0],
                padding: [0, 10],
                ...inputStyle,
              }}
            />
            <forwardcomplete>
              {store.peekItem}
            </forwardcomplete>
            <pasteicon if={false}>
              <UI.Icon size={50} type="detailed" name="paper" />
            </pasteicon>
          </div>
          <Miller
            search={store.search}
            version={store.millerStateVersion}
            state={store.millerState}
            panes={store.PANE_TYPES}
            onChange={store.onMillerStateChange}
            paneProps={paneProps}
            onActions={val => {
              console.log('actions', val)
              store.millerActions = val
            }}
          />
        </bar>
      </UI.Theme>
    )
  }

  static style = {
    bar: {
      background: [145, 145, 145, 0.5],
      margin: 30,
      flex: 1,
    },
    omni: {
      height: 100,
    },
    // pos textbox over nav so they don't collide when nav is opacity 0
    textbox: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    nav: {
      flex: 1,
      userSelect: 'none',
      padding: [20, 5],
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'opacity ease-in 150ms',
      opacity: 0,
    },
    showNav: {
      opacity: 1,
    },
    left: {
      position: 'absolute',
      left: 3,
      top: 20,
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
    section: {
      width: '50%',
      height: '100%',
    },
    content: {
      flex: 1,
      height: '100%',
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
      top: 28,
      left: 20,
      opacity: 0.3,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
  }
}

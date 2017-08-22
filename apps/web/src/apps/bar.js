// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys, OS } from '~/helpers'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { MillerState, Miller } from './miller'
import { isNumber, last, debounce } from 'lodash'

const safeString = thing => {
  try {
    return JSON.stringify(thing)
  } catch (e) {
    console.log('non safe object', thing)
    return `${thing}`
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
  millerState = MillerState.serialize([{ kind: 'main', data: { prefix: '' } }])
  millerStateVersion = 0

  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''

  visible = true

  start() {
    this.on(window, 'focus', this.onFocus)
  }

  onFocus = () => {
    console.log('focus bar window')
    this.inputRef.focus()
    this.inputRef.select()
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

  PANE_TYPES = {
    main: Panes.Main,
    placeholder: Panes.Placeholder,
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
    integrations: Panes.Integrations,
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
      if (!this.hasSelectedItem) {
        // this.inputRef.blur()
      }
      this.millerActions.down()
      e.preventDefault()
    },
    up: e => {
      if (this.millerState.activeRow > 0) {
        this.millerActions.up()
      }

      e.preventDefault()
    },
    esc: () => {
      if (this.search !== '') {
        this.search = ''
      } else {
        this.visible = false
        OS.send('bar-hide')
      }
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: () => {
      const schema = JSON.stringify(last(this.millerState.schema))
      OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
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

  navigate = thing => {
    if (thing && thing.url) {
      OS.send('bar-goto', thing.url())
    } else if (typeof thing === 'string') {
      console.log('got a navigate weird thing', thing)
      OS.send('bar-goto', thing)
    }
  }
}

const inputStyle = {
  fontWeight: 300,
  color: '#fff',
  fontSize: 38,
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
      <HotKeys handlers={store.actions}>
        <UI.Theme name="clear-dark">
          <bar
            ref={store.ref('barRef').set}
            $$fullscreen
            $$draggable
            $visible={store.visible}
          >
            <div>
              <UI.Input
                size={3}
                getRef={store.ref('inputRef').set}
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
              <forwardComplete>
                {store.peekItem}
              </forwardComplete>
              <pasteIcon if={false}>
                <UI.Icon size={50} type="detailed" name="paper" />
              </pasteIcon>
              <selected
                if={false}
                css={{
                  position: 'absolute',
                  top: 80,
                  left: 0,
                  right: 0,
                  height: 20,
                  fontSize: 12,
                  overflow: 'hidden',
                  opacity: 0.8,
                  color: '#fff',
                }}
              >
                Selected: {safeString(store.activeItem)}
              </selected>
            </div>
            <Miller
              search={store.search}
              version={store.millerStateVersion}
              state={store.millerState}
              panes={store.PANE_TYPES}
              onChange={store.onMillerStateChange}
              paneProps={paneProps}
              onActions={store.ref('millerActions').set}
            />
          </bar>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    bar: {
      background: [145, 145, 145, 0.5],
      flex: 1,
      // opacity: 0,
      // transition: 'all ease-in 300ms',
    },
    visible: {
      opacity: 1,
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
    pushRight: {
      transform: {
        x: '-50%',
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
    pasteIcon: {
      position: 'absolute',
      top: -30,
      right: -20,
      width: 128,
      height: 128,
    },
    forwardComplete: {
      position: 'absolute',
      top: 35,
      left: 20,
      opacity: 0.3,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
  }
}

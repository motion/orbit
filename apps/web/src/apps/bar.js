// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { MillerState, Miller } from './miller'
import { range, isNumber, last, random } from 'lodash'

const safeString = thing => {
  try {
    return JSON.stringify(thing)
  } catch (e) {
    console.log('non safe object', thing)
    return `${thing}`
  }
}
const { ipcRenderer } = (window.require && window.require('electron')) || {}
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

  search = ''

  onMillerStateChange = state => {
    this.millerState = state
    this.millerStateVersion++
  }

  PANE_TYPES = {
    main: Panes.Main,
    setup: Panes.Setup,
    inbox: Panes.Threads,
    browse: Panes.Browse,
    feed: Panes.Feed,
    notifications: Panes.Notifications,
    login: Panes.Login,
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
    down: () => {
      this.millerActions.down()
    },
    up: () => {
      this.millerActions.up()
    },
    esc: () => {
      console.log('got esc')
      this.visible = false
      ipcRenderer.send('bar-hide')
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: () => {
      const schema = JSON.stringify(last(this.millerState.schema))
      ipcRenderer.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
    },
    right: () => {
      if (this.hasSelectedItem) this.millerActions.right()
    },
    left: () => {
      if (this.hasSelectedItem) this.millerActions.left()
    },
  }

  newWindow = url => {
    ipcRenderer.send('where-to', url)
  }

  navigate = thing => {
    log('navigate yo', thing, thing.url)
    if (thing && thing.url) {
      ipcRenderer.send('bar-goto', thing.url())
    } else if (typeof thing === 'string') {
      console.log('got a navigate weird thing', thing)
      ipcRenderer.send('bar-goto', thing)
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
    log('hlindex', store.highlightIndex)

    const paneProps = {
      itemProps: {
        size: 1.55,
        glow: false,
        hoverable: true,
        fontSize: 26,
        padding: [0, 10],
        height: 48,
        highlightBackground: [0, 0, 0, 0.15],
        highlightColor: [255, 255, 255, 1],
      },
    }

    return (
      <HotKeys handlers={store.actions}>
        <UI.Theme name="clear-dark">
          <bar $$fullscreen $$draggable $visible={store.visible}>
            <div>
              <UI.Input
                size={3}
                getRef={store.ref('inputRef').set}
                borderRadius={5}
                onChange={e => (store.search = e.target.value)}
                value={store.search}
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
              <pasteIcon>
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
              animate
              search={store.search}
              version={store.millerStateVersion}
              state={store.millerState}
              panes={store.PANE_TYPES}
              onChange={store.onMillerStateChange}
              paneProps={paneProps}
              onActions={actions => (store.millerActions = actions)}
            />
          </bar>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    bar: {
      background: [150, 150, 150, 0.5],
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

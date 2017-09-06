// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import { view } from '@mcro/black'
import { OS } from '~/helpers'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { MillerState, Miller } from './miller'
import { isNumber, debounce } from 'lodash'
import Mousetrap from 'mousetrap'
import { SHORTCUTS } from '~/stores/rootStore'

const safeString = thing => {
  try {
    return JSON.stringify(thing)
  } catch (e) {
    console.log('non safe object', thing)
    return `${thing}`
  }
}

@view.ui
class Actions {
  render() {
    const actions = ['Archive', 'Reply', 'Delete', 'Forward']

    return (
      <bar $$draggable>
        <section>
          <UI.Text $label>Team: Motion</UI.Text>
        </section>
        <section>
          <UI.Text $label>⌘ Actions</UI.Text>
          {actions.map(action => (
            <UI.Text $text key={action}>
              <icon if={false}>⌘</icon>&nbsp;<strong>{action[0]}</strong>
              <rest>{action.slice(1)}</rest>
            </UI.Text>
          ))}
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
    text: {
      marginLeft: 10,
      marginRight: 5,
    },
    icon: {
      opacity: 0.5,
      display: 'inline',
      fontSize: 12,
    },
    strong: {
      fontWeight: 400,
      opacity: 1,
      color: '#fff',
    },
    rest: {
      display: 'inline',
      opacity: 0.8,
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

  // search is throttled, textboxVal isn't
  search = ''
  textboxVal = ''

  start() {
    this.on(window, 'focus', this.onFocus)
  }

  onFocus = () => {
    console.log('focus bar window')
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
    }
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
    esc: e => {
      e.preventDefault()
      if (this.search !== '') {
        this.search = ''
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
  trap: MouseTrap

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this)
    this.trap = new Mousetrap(node)
    for (const name of Object.keys(SHORTCUTS)) {
      if (this.props.store.actions[name]) {
        const chord = SHORTCUTS[name]
        this.trap.bind(chord, this.props.store.actions[name])
      }
    }
  }

  render({ store }) {
    const paneProps = {
      itemProps: {
        size: 1.2,
        glow: false,
        hoverable: true,
        fontSize: 26,
        padding: [0, 10],
        height: 40,
        highlightBackground: [0, 0, 0, 0.2],
        highlightColor: [255, 255, 255, 1],
      },
    }

    return (
      <UI.Theme name="clear-dark">
        <bar ref={store.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Input
              size={2.6}
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
            <forwardcomplete>{store.peekItem}</forwardcomplete>
            <pasteicon if={false}>
              <UI.Icon size={50} type="detailed" name="paper" />
            </pasteicon>
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
          </header>
          <Miller
            search={store.search}
            version={store.millerStateVersion}
            state={store.millerState}
            panes={store.PANE_TYPES}
            onChange={store.onMillerStateChange}
            paneProps={paneProps}
            onActions={store.ref('millerActions').set}
          />

          <Actions />
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

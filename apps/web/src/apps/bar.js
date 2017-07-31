// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import * as UI from '@mcro/ui'
import * as Panes from './panes'

const { ipcRenderer } = (window.require && window.require('electron')) || {}

class BarStore {
  column = 0
  highlightedRow = [0]
  value = ''
  panes = []
  pushRight = false
  state = {
    paneRefs: [],
  }

  get highlightIndex() {
    return this.highlightedRow[this.column] || 0
  }

  set highlightIndex(value) {
    this.highlightedRow[this.column] = value
    this.highlightedRow = [...this.highlightedRow]
  }

  get activePane() {
    return this.state.paneRefs[this.column]
  }

  get activeItem() {
    return this.activePane && this.activePane.results[this.highlightIndex]
  }

  get parent() {
    return this.state.paneRefs[this.column - 1]
  }

  get parentItem() {
    return this.parent && this.parent[this.highlightedRow[this.column - 1]]
  }

  start() {
    this.pushPane(Panes.Main)
    this.watchPaneSelections()
    this.watchForFocus()
  }

  lastSet = []

  watchPaneSelections = () => {
    this.watch(() => {
      const { activeItem, column, highlightIndex } = this
      const [lastCol, lastRow] = this.lastSet
      const nextColumn = column + 1
      if (nextColumn === lastCol && highlightIndex === lastRow) {
        return
      }
      this.setColumn(nextColumn, activeItem)
      this.lastSet = [nextColumn, highlightIndex]
    })
  }

  PANE_TYPES = {
    setup: Panes.Setup,
    browse: Panes.Browse,
    feed: Panes.Feed,
    notifications: Panes.Notifications,
    login: Panes.Login,
  }

  setColumn = (column, activeItem) => {
    console.log('setColumn', column, !!activeItem)
    if (activeItem) {
      const Pane = this.PANE_TYPES[activeItem.type] || Panes.Preview
      this.setColumnTo(column, Pane)
      console.log('set to column', activeItem.type)
    }
  }

  setColumnTo = (column, pane) => {
    if (!pane) {
      console.error('no pane', pane)
      return null
    }
    this.panes[column] = pane
    this.panes = this.panes.slice(0, column + 1) // remove anything below
  }

  watchForFocus = () => {
    this.on(window, 'focus', () => {
      console.log('focus bar window')
      this.inputRef.focus()
      this.inputRef.select()
    })
  }

  pushPane = pane => {
    this.panes.push(pane)
  }

  moveHighlight = (diff: number) => {
    this.highlightIndex += diff
    if (this.highlightIndex === -1) {
      this.highlightIndex = this.activePane.length - 1
    }
    if (this.highlightIndex >= this.activePane.length) {
      this.highlightIndex = 0
    }
  }

  onEnter = async () => {
    if (this.highlightIndex > -1) {
      this.select()
    }
  }

  onSelect = item => {
    console.log('select', item)
  }

  select = () => {
    this.activePane.select(this.highlightIndex)
  }

  onChange = ({ target: { value } }) => {
    this.value = value
  }

  actions = {
    right: () => {
      if (this.column === 1) {
        this.pushRight = true
      } else {
        this.column = this.column + 1
      }
    },
    down: () => {
      log('down')
      this.moveHighlight(1)
    },
    up: () => {
      this.moveHighlight(-1)
    },
    left: () => {
      if (this.pushRight) {
        this.pushRight = false
      } else {
        this.column = Math.max(0, this.column - 1)
      }
    },
    esc: () => {
      console.log('got esc')
      ipcRenderer.send('bar-hide')
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: () => {
      this.select()
    },
  }

  navigate = thing => {
    log('navigate yo', thing)
    if (thing && thing.url) {
      ipcRenderer.send('bar-goto', thing.url())
    } else if (typeof thing === 'string') {
      console.log('got a navigate weird thing', thing)
      ipcRenderer.send('bar-goto', thing)
    }
  }
}

@view({
  store: BarStore,
})
export default class BarPage {
  render({ store }) {
    log(store.highlightIndex)
    store.highlightIndex
    store.column

    const itemProps = {
      highlightBackground: [0, 0, 0, 0.15],
      highlightColor: [255, 255, 255, 1],
    }

    return (
      <HotKeys handlers={store.actions}>
        <UI.Theme name="clear-dark">
          <bar $$fullscreen $$draggable>
            <div>
              <UI.Input
                size={3}
                getRef={store.ref('inputRef').set}
                borderRadius={5}
                onChange={store.onChange}
                borderWidth={0}
                css={{
                  padding: [0, 10],
                }}
              />
              <pasteIcon>
                <UI.Icon size={50} type="detailed" name="paper" />
              </pasteIcon>
              <selected
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
                Selected: {JSON.stringify(store.activeItem)}
              </selected>
            </div>
            <results $pushRight={store.pushRight}>
              {store.panes.map((Pane, index) =>
                <section key={Pane.name || Math.random()}>
                  <content $list>
                    <Pane
                      itemProps={itemProps}
                      highlightIndex={store.highlightIndex}
                      column={store.column}
                      isActive={store.column === index}
                      activeItem={store.activeItem}
                      search={store.value}
                      parent={store.parentItem}
                      navigate={store.navigate}
                      getRef={ref => {
                        store.state.paneRefs[index] = ref
                      }}
                      onSelect={store.onSelect}
                      itemProps={{
                        size: 1.75,
                        glow: false,
                        hoverable: true,
                        fontSize: 32,
                        padding: [18, 10],
                        height: 60,
                      }}
                    />
                  </content>
                  <line
                    css={{
                      width: 0,
                      marginTop: 1,
                      borderLeft: [1, 'dotted', [0, 0, 0, 0.1]],
                    }}
                  />
                </section>
              )}
            </results>
          </bar>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    bar: {
      background: [150, 150, 150, 0.5],
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
  }
}

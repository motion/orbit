// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import * as UI from '@mcro/ui'
import * as Panes from './panes'

const { ipcRenderer } = (window.require && window.require('electron')) || {}

class BarStore {
  column = 0
  highlightIndex = 1
  value = ''
  panes = []
  paneRefs = []

  get activePane() {
    return this.paneRefs[this.column]
  }

  get activeItem() {
    return this.activePane && this.activePane.results[this.highlightIndex]
  }

  start() {
    this.pushPane(Panes.Main)
    this.watchPaneSelections()
    this.watchForFocus()
  }

  watchPaneSelections = () => {
    this.watch(() => {
      const { activeItem, column } = this
      const nextColumn = column + 1

      if (activeItem) {
        if (activeItem.type === 'pane') {
          this.setColumn(nextColumn, Panes[activeItem.title])
        } else {
          // is a Thing
          this.setColumn(nextColumn, Panes.Preview)
        }
      }
    })
  }

  setColumn = (column, pane) => {
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
      this.column = this.column + 1
    },
    down: () => {
      log('down')
      this.moveHighlight(1)
    },
    up: () => {
      this.moveHighlight(-1)
    },
    left: () => {
      this.column = Math.max(0, this.column - 1)
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
              <selected
                css={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  width: 200,
                  height: 200,
                  fontSize: 16,
                }}
              >
                Selected: {JSON.stringify(store.activeItem)}
              </selected>
            </div>
            <results $column={store.column}>
              {store.panes.map((Pane, index) =>
                <section
                  css={{
                    width: '50%',
                    height: '100%',
                  }}
                  key={Pane.name || Math.random()}
                >
                  <content $list>
                    <Pane
                      itemProps={itemProps}
                      highlightIndex={store.highlightIndex}
                      column={store.column}
                      isActive={store.column === index}
                      activeItem={store.activeItem}
                      search={store.value}
                      getRef={store.ref(`paneRefs.${index}`).set}
                      onSelect={store.onSelect}
                      itemProps={{
                        size: 2.5,
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
    },
    column: column => ({
      transform: {
        x: column > 1 ? '-50%' : 0,
        z: 0,
      },
    }),
  }
}

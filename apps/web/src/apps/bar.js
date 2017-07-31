// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import * as UI from '@mcro/ui'
import * as Panes from './panes'

const { ipcRenderer } = (window.require && window.require('electron')) || {}

class BarStore {
  column = 0
  highlightIndex = 0
  value = ''
  panes = []
  paneRefs = []

  get activePane() {
    return this.pane[this.column]
  }

  get activePaneRef() {
    return this.paneRefs[this.column]
  }

  start() {
    this.pushPane(Panes.Main)

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
      this.highlightIndex = this.results.length - 1
    }
    if (this.highlightIndex >= this.results.length) {
      this.highlightIndex = 0
    }
  }

  onEnter = async () => {
    if (this.highlightIndex > -1) {
      this.select()
    }
  }

  select = () => {
    this.activePaneRef.select(this.highlightIndex)
  }

  onChange = ({ target: { value } }) => {
    this.value = value
  }

  actions = {
    right: () => {
      this.column = this.column + 1
    },
    down: () => {
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
            </div>
            <results $column={store.column}>
              {store.panes.map((Pane, index) =>
                <section key={Pane.name || Math.random()}>
                  <content
                    $list
                    css={{
                      width: '50%',
                      height: '100%',
                    }}
                  >
                    <Pane
                      itemProps={itemProps}
                      highlightIndex={store.highlightIndex}
                      column={store.column}
                      active={store.column === index}
                      ref={ref => {
                        this.paneRefs[index] = ref
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
      // transition: 'transform ease-in 32ms',
    },
    column: column => ({
      transform: {
        x: column > 1 ? '-50%' : 0,
        z: 0,
      },
    }),
    item: {
      fontSize: 38,
      padding: [18, 10],
    },
  }
}

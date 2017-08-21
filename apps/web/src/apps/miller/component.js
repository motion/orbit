// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { sum, range } from 'lodash'

class MillerStore {
  // refs to the plugins
  plugins = []
  colWidths = range(100).map(() => 0)
  colLeftMargin = 10

  start() {
    const { state, onChange } = this.props
    window.millerState = state

    const handleSchemaChanges = () => {
      const { activeRow, activeCol } = state
      const plugin = this.plugins[activeCol]
      if (activeRow !== null && plugin && plugin.getChildSchema) {
        const child = plugin.getChildSchema(activeRow)
        if (child !== null) state.setSchema(activeCol + 1, child)
      }

      onChange(state)
    }

    state.onSelectionChange(() => {
      handleSchemaChanges()
    })

    setTimeout(() => {
      handleSchemaChanges()
    })
  }

  get translateX() {
    const { state } = this.props
    if (state.activeCol === 0) return 0
    return (
      -sum(this.colWidths.slice(0, state.activeCol)) -
      this.colLeftMargin * state.activeCol
    )
  }

  onSelect(col, row) {
    const { state } = this.props
    state.setSelection(col, row)
  }

  actions = {
    right: () => {
      const { state } = this.props
      state.moveCol(1)
    },
    down: () => {
      const { state } = this.props
      const len = 50 // this.plugins[state.activeCol].getLength() - 1
      if (state.activeRow === null || state.activeRow < len) {
        state.moveRow(1)
      }
    },
    up: () => {
      const { state } = this.props
      state.moveRow(-1)
    },
    left: () => {
      const { state } = this.props
      state.moveCol(-1)
    },
    esc: () => {},
    cmdA: () => {},
    cmdEnter: () => {},
    enter: () => {},
  }
}

@view
class Pane {
  render({
    pane,
    onRef,
    paneProps,
    state,
    onMeasureWidth,
    data,
    search,
    onSelect,
    col,
    type,
  }) {
    const paneActive = state.activeCol == col
    const highlightIndex = !paneActive && state.prevActiveRows[col]
    const activeIndex = paneActive && state.activeRow
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <ChildPane
        paneProps={paneProps}
        data={data || {}}
        onSelect={onSelect}
        onRef={ref => {
          onRef(ref)
          this.pane = ref
        }}
        search={paneActive ? search : ''}
        highlightIndex={highlightIndex}
        activeIndex={activeIndex}
      />
    )
  }

  static style = {
    pane: {
      height: '100%',
      borderLeft: [1, [0, 0, 0, 0.05]],
    },
    first: {
      borderLeft: 'none',
    },
  }
}

@view({
  store: MillerStore,
})
export default class Miller {
  static defaultProps = {
    onActions: _ => _,
  }

  componentWillMount() {
    const { onActions, store } = this.props
    onActions(store.actions)
  }

  render({ store, paneProps, onActions, search, panes, animate, state }) {
    const { schema } = state
    const transX = animate ? store.translateX : 0

    const content = (
      <miller css={{ flex: 1 }}>
        <columns $$row $transX={transX}>
          {schema.map((pane, index) => {
            return (
              <Pane
                key={index > state.activeCol ? Math.random() : index}
                // if it's the next preview, always rerender
                pane={panes[pane.kind]}
                type={pane.type}
                data={pane.data}
                search={search}
                paneProps={paneProps}
                onMeasureWidth={width => (store.colWidths[index] = width)}
                col={index}
                onRef={plugin => {
                  store.plugins[index] = plugin
                }}
                onSelect={row => store.onSelect(index, row)}
                state={state}
              />
            )
          })}
        </columns>
      </miller>
    )

    if (onActions) {
      return content
    }

    return (
      <HotKeys handlers={store.actions}>
        {content}
      </HotKeys>
    )
  }

  static style = {
    columns: {
      flex: 1,
      transition: 'transform 80ms linear',
      transform: {
        z: 0,
        x: 0,
      },
    },
    transX: x => ({ transform: { x } }),
  }
}

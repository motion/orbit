// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import { sum, range } from 'lodash'

class MillerStore {
  // refs to the plugins
  plugins = []
  colWidths = range(100).map(() => 0)
  colLeftMargin = 10

  start() {
    const { state, onChange } = this.props
    window.millerState = state

    state.onSelectionChange(() => {
      const { activeRow, activeCol } = state
      const plugin = this.plugins[activeCol]
      if (activeRow !== null && plugin && plugin.getChildSchema) {
        const child = plugin.getChildSchema(activeRow)
        if (child !== null) state.setSchema(activeCol + 1, child)
      }

      onChange(state)
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
      if (state.activeRow < this.plugins[state.activeCol].getLength() - 1) {
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
  }) {
    const paneActive = state.activeCol == col
    const highlightIndex = !paneActive && state.prevActiveRows[col]
    const activeIndex = paneActive && state.activeRow
    const Pane = pane

    return (
      <pane css={{ flex: 1 }} ref={el => el && onMeasureWidth(el.clientWidth)}>
        <Pane
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
      </pane>
    )
  }
}

@view({
  store: MillerStore,
})
export default class Miller {
  componentWillMount() {
    const { onActions, store } = this.props

    onActions && onActions(store.actions)
  }

  render({ store, paneProps, onActions, search, panes, animate, state }) {
    const { schema } = state
    const transX = animate ? store.translateX : 0

    const content = (
      <columns $$row $transX={transX}>
        {schema.map((pane, index) =>
          <column key={index > state.activeCol ? Math.random() : index}>
            <Pane
              // if it's the next preview, always rerender
              pane={panes[pane.kind]}
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
          </column>
        )}
      </columns>
    )

    if (onActions) return content

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
    column: {
      flex: 1,
    },
  }
}

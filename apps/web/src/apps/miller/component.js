// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { sum, range } from 'lodash'

class MillerStore {
  plugins = []
  colWidths = range(100).map(() => 0)
  colLeftMargin = 10

  start() {
    const { state, onChange } = this.props
    window.millerState = state

    const handleSchemaChanges = () => {
      const { activeRow, activeCol } = state
      const plugin = this.plugins[activeCol]
      if (activeRow !== null && plugin && plugin.results) {
        const current = plugin.results[activeRow]
        if (current !== null) {
          state.setSchema(activeCol + 1, current)
        }
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

  get activePlugin() {
    return this.plugins[this.props.state.activeCol]
  }

  get activeResults() {
    return this.activePlugin.results
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
      if (
        state.activeRow === null ||
        (this.activeResults && state.activeRow < this.activeResults.length - 1)
      ) {
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
    getRef,
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
      <pane
        ref={ref => {
          ref && onMeasureWidth(ref.offsetWidth)
        }}
      >
        <ChildPane
          paneProps={paneProps}
          data={data || {}}
          isActive={paneActive}
          onSelect={onSelect}
          getRef={ref => {
            getRef(ref)
            this.pane = ref
          }}
          search={paneActive ? search : ''}
          highlightIndex={highlightIndex}
          activeIndex={activeIndex}
        />
      </pane>
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
              <pane $grow={index === schema.length - 1}>
                <Pane
                  key={index + ':' + pane.kind}
                  // if it's the next preview, always rerender
                  pane={panes[pane.type]}
                  type={pane.type}
                  data={pane.data}
                  search={search}
                  paneProps={paneProps}
                  onMeasureWidth={width => (store.colWidths[index] = width)}
                  col={index}
                  getRef={plugin => {
                    store.plugins[index] = plugin
                  }}
                  onSelect={row => store.onSelect(index, row)}
                  state={state}
                />
              </pane>
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
    grow: {
      flex: 1,
    },
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

// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { sum, range } from 'lodash'

class MillerStore {
  colWidths = range(100).map(() => 0)
  paneWidth = null
  colLeftMargin = 10

  start() {
    this.props.state.onSelectionChange(this.handleSelectionChange)
    this.props.state.onChange(this.props.onChange)
    this.setTimeout(this.handleSelectionChange)
  }

  handleSelectionChange = () => {
    const { state, onChange } = this.props
    if (state.activeRow !== null && state.activeResults) {
      if (state.activeItem && state.activeItem.showChild !== false) {
        state.setSchema(state.activeCol + 1, state.activeItem)
      }
    }
    onChange(state)
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
      if (
        state.activeRow === null ||
        (state.activeResults &&
          state.activeRow < state.activeResults.length - 1)
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
    width,
    millerState,
    type,
  }) {
    const paneActive = state.activeCol == col
    const highlightIndex = !paneActive && state.prevActiveRows[col]
    const activeRow = paneActive && state.activeRow
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <pane
        css={{
          flex: 1,
          width,
        }}
        ref={ref => {
          ref && onMeasureWidth(ref.offsetWidth)
        }}
      >
        <ChildPane
          paneProps={paneProps}
          data={data || {}}
          millerState={millerState}
          isActive={paneActive}
          onSelect={onSelect}
          getRef={ref => {
            console.log('giving ref for ', type)
            getRef(ref)
            this.pane = ref
          }}
          search={paneActive ? search : ''}
          highlightIndex={highlightIndex}
          activeRow={activeRow}
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
      <miller
        ref={el => {
          if (el) {
            store.paneWidth = el.offsetWidth
          }
        }}
        css={{ flex: 1 }}
      >
        <columns $$row $transX={transX}>
          {schema.map((pane, index) => {
            return (
              <pane
                key={index + ':' + pane.kind}
                $grow={index === schema.length - 1}
              >
                <Pane
                  // if it's the next preview, always rerender
                  pane={panes[pane.type]}
                  type={pane.type}
                  width={index === schema.length - 1 && store.paneWidth}
                  data={pane.data}
                  search={search}
                  paneProps={paneProps}
                  onMeasureWidth={width => (store.colWidths[index] = width)}
                  col={index}
                  millerState={state}
                  getRef={plugin => {
                    state.setPlugin(index, plugin)
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
    pane: {
      //overflowY: 'scroll',
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

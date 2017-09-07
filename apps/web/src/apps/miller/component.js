import * as React from 'react'
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
      if (
        state.activeItem &&
        state.activeItem.type &&
        state.activeItem.showChild !== false
      ) {
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

  keyActions = {
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
class Pane extends React.Component {
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
    const isActive = state.activeCol == col
    const highlightIndex = !isActive && state.prevActiveRows[col]
    const isFirst = col === 0
    const activeIndex = isActive && state.activeRow
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
          isActive={isActive}
          onSelect={onSelect}
          getRef={ref => {
            getRef(ref)
            this.pane = ref
          }}
          search={search}
          highlightIndex={highlightIndex}
          selectedIndices={[]}
          activeIndex={activeIndex}
        />
      </pane>
    )
  }

  static style = {
    pane: {
      flex: 1,
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
export default class Miller extends React.Component {
  static defaultProps = {
    onKeyActions: _ => _,
  }

  componentWillMount() {
    const { onKeyActions, store } = this.props
    onKeyActions(store.keyActions)
  }

  render({ store, paneProps, onKeyActions, search, panes, animate, state }) {
    const { schema } = state
    const transX = animate ? store.translateX : 0

    const content = (
      <miller css={{ flex: 1 }}>
        <columns $$row $transX={transX}>
          {schema.map((pane, index) => {
            return (
              <pane $notFirst={index > 0} key={index + ':' + pane.kind}>
                <Pane
                  // if it's the next preview, always rerender
                  pane={panes[pane.type]}
                  type={pane.type}
                  data={pane.data}
                  search={search}
                  paneProps={paneProps}
                  millerState={state}
                  onMeasureWidth={width => (store.colWidths[index] = width)}
                  col={index}
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

    if (onKeyActions) {
      return content
    }

    return (
      <HotKeys handlers={store.keyActions}>
        {content}
      </HotKeys>
    )
  }

  static style = {
    // hang off edge
    pane: {
      height: '100%',
    },
    notFirst: {
      overflow: 'visible',
      width: '69%',
      background: 'white',
      boxShadow: '1px 1px 3px rgba(0,0,0,.4)',
      // overflow: 'scroll',
    },
    columns: {
      flex: 1,
      transition: 'transform 80ms linear',
      // transform: {
      //   z: 0,
      //   x: 0,
      // },
    },
    transX: x => ({ transform: { x } }),
  }
}

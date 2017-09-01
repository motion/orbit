// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { sum, range } from 'lodash'
import { throttle } from 'lodash-decorators'

class MillerStore {
    colWidths = range(100).map(() => 0)
    paneWidth = null
    colLeftMargin = 10

    start() {
        this.props.state.onSelectionChange(this.handleSelectionChange)
        this.props.state.onChange(this.props.onChange)
        this.setTimeout(this.handleSelectionChange)
    }

    @throttle(16)
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
        esc: () => { },
        cmdA: () => { },
        cmdEnter: () => { },
        enter: () => { },
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
        const activeRow = isActive && state.activeRow
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
                    activeRow={activeRow}
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
                        const isCard = index > 0 && index === schema.length - 1
                        const isActive = index === state.activeCol

                        return (
                            <pane
                                key={index + ':' + pane.kind}
                                $grow={isCard}
                                $pullLeft={index !== 0 && isActive}
                                $upcoming={index !== 0 && !isActive}
                            >
                                <Pane
                                    // if it's the next preview, always rerender
                                    pane={panes[pane.type]}
                                    type={pane.type}
                                    // width={index === schema.length - 1 && store.paneWidth}
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
        // hang off edge
        pane: {
            transform: 'translate3d(0, 0, 0)',
            transformOrigin: 'top left',
            transition: 'transform 50ms ease-in',
        },
        upcoming: {
            transform: 'scale(0.96)',
        },
        pullLeft: {
            transform: 'translate3d(-30px, -30px, 0) scale(1)',
        },
        grow: {
            overflow: 'visible',
            width: '69%',
            height: '106%',
            background: 'white',
            boxShadow: '1px 1px 5px rgba(0,0,0,.5)',
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

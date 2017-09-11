import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { sum, range } from 'lodash'

class MillerStore {}

@view.attach('millerState')
@view
class Pane extends React.Component {
  render({
    pane,
    paneProps,
    state,
    data,
    search,
    index,
    col,
    width,
    millerState,
    type,
  }) {
    const isActive = state.activeCol == col
    const highlightIndex = !isActive && state.prevActiveRows[col]
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
          if (ref) {
            millerState.colWidths[index] = ref.offsetWidth
          }
        }}
      >
        <ChildPane
          paneProps={paneProps}
          data={data || {}}
          millerState={millerState}
          isActive={isActive}
          onSelect={row => millerState.setSelection(index, row)}
          getRef={ref => {
            millerState.setPlugin(index, ref)
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

@view.attach('millerState')
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

  render({
    store,
    paneProps,
    onKeyActions,
    search,
    panes,
    animate,
    millerState,
  }) {
    const { schema } = millerState
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
                  index={index}
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

    return <HotKeys handlers={store.keyActions}>{content}</HotKeys>
  }

  static style = {
    pane: {
      height: '100%',
    },
    notFirst: {
      flex: 1,
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

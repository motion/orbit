import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { isEqual } from 'lodash'
import MillerStore from './millerStore'

@view({
  store: MillerStore,
})
export default class Miller extends React.Component {
  static defaultProps = {
    onKeyActions: _ => _,
  }

  state = {
    schema: null,
  }

  componentWillMount() {
    const { onKeyActions, store, state } = this.props
    onKeyActions(store.keyActions)
    this.setState({ schema: state.schema })
  }

  componentWillReceiveProps({ state }) {
    if (!isEqual(state.schema, this.state.schema)) {
      // :car: setTimeout will make the next render happen after list updates highlight position
      this.setTimeout(() => {
        this.setState({ schema: state.schema })
      })
    }
  }

  render(
    { pane, state, store, paneProps, onKeyActions, search, panes, animate },
    { schema }
  ) {
    const Pane = pane
    const transX = animate ? store.translateX : 0
    const content = (
      <miller css={{ flex: 1 }}>
        <columns $$row $transX={transX}>
          {schema.map((pane, index) => {
            return (
              <pane $notFirst={index > 0} key={index + ':' + pane.kind}>
                <Pane
                  pane={panes[pane.type]}
                  type={pane.type}
                  data={pane.data}
                  search={search}
                  paneProps={paneProps}
                  col={index}
                  getRef={plugin => {
                    state.setPlugin(index, plugin)
                  }}
                  state={state}
                  millerStore={store}
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
    // hang off edge
    pane: {
      height: '100%',
    },
    notFirst: {
      flex: 1,
      // background: 'white',
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

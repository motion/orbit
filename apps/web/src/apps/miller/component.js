import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import { isEqual, memoize } from 'lodash'
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

  // memoize to avoid mobx break
  handleRef = memoize(index => plugin => {
    this.props.state.setPlugin(index, plugin)
  })

  render({ pane, state, store, onKeyActions, panes, animate }, { schema }) {
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
                  col={index}
                  getRef={this.handleRef(index)}
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
    },
    columns: {
      flex: 1,
      transition: 'transform 80ms linear',
    },
    transX: x => ({ transform: { x } }),
  }
}

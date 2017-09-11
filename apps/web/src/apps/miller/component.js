import * as React from 'react'
import { view } from '@mcro/black'
import { isEqual } from 'lodash'
import { HotKeys } from '~/helpers'

@view.attach('millerState')
@view
export default class Miller extends React.Component {
  static defaultProps = {
    onKeyActions: _ => _,
  }

  state = {
    schema: null,
  }

  componentWillMount() {
    const { onKeyActions, millerState } = this.props
    console.log('ms is', millerState)
    onKeyActions(millerState.keyActions)
    this.setState({ schema: millerState.schema })
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
    { pane, store, search, millerState, onKeyActions, panes, animate },
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
    },
    transX: x => ({ transform: { x } }),
  }
}

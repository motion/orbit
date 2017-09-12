import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
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
    onKeyActions(millerState.keyActions)
    this.setState({ schema: millerState.schema })
  }

  componentWillReceiveProps({ millerState }) {
    if (!isEqual(millerState.schema, this.state.schema)) {
      // :car: setTimeout will make the next render happen after list updates highlight position
      this.setTimeout(() => {
        this.setState({ schema: millerState.schema })
      })
    }
  }

  render(
    { pane, store, millerState, onKeyActions, panes, animate },
    { schema }
  ) {
    const Pane = pane
    const transX = animate ? store.translateX : 0

    const content = (
      <miller css={{ flex: 1 }}>
        <columns $$row $transX={transX}>
          {millerState.schema.map((pane, index) => {
            return (
              <pane $notFirst={index > 0} key={index + ':' + pane.kind}>
                <Pane
                  pane={panes[pane.type]}
                  type={pane.type}
                  data={pane.data}
                  index={index}
                />
              </pane>
            )
          })}
        </columns>
        <UI.Popover
          if={millerState.activeAction}
          open={true}
          onClose={() => {
            millerState.activeAction = null
          }}
          borderRadius={5}
          elevation={3}
          target={`.target-${millerState.activeAction.name}`}
          overlay="transparent"
          distance={8}
        >
          {millerState.activeAction.popover}
        </UI.Popover>
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

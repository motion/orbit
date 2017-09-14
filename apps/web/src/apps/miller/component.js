import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { HotKeys } from '~/helpers'

@view.attach('millerState')
@view
export default class Miller extends React.PureComponent {
  static defaultProps = {
    onKeyActions: _ => _,
  }

  componentWillMount() {
    const { onKeyActions, millerState } = this.props
    onKeyActions(millerState.keyActions)
  }

  onPopoverClose = () => {
    this.props.millerState.activeAction = null
  }

  render({ pane, store, millerState, onKeyActions, panes, animate }) {
    const Pane = pane
    const transX = animate ? store.translateX : 0
    const PopoverContent =
      millerState.activeAction && millerState.activeAction.popover

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
          theme="light"
          onClose={this.onPopoverClose}
          borderRadius={5}
          elevation={3}
          target={`.target-${millerState.activeAction.name}`}
          overlay="transparent"
          distance={14}
        >
          <PopoverContent onClose={this.onPopoverClose} />
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

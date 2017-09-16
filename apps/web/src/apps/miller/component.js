import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { HotKeys } from '~/helpers'

@view.attach('millerStore')
@view
export default class Miller {
  static defaultProps = {
    onKeyActions: _ => _,
  }

  componentWillMount() {
    const { onKeyActions, millerStore } = this.props
    onKeyActions(millerStore.keyActions)
  }

  onPopoverClose = () => {
    this.props.millerStore.activeAction = null
  }

  render({ pane, store, millerStore, onKeyActions, panes, animate }) {
    const Pane = pane
    const transX = animate ? store.translateX : 0
    const PopoverContent =
      millerStore.activeAction && millerStore.activeAction.popover

    const content = (
      <miller css={{ flex: 1 }}>
        <columns $$row $transX={transX}>
          {millerStore.schema.map((pane, index) => {
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
          if={millerStore.activeAction}
          open={true}
          theme="light"
          onClose={this.onPopoverClose}
          borderRadius={5}
          elevation={3}
          target={`.target-${millerStore.activeAction.name}`}
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
      overflow: 'hidden',
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

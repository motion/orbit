import * as React from 'react'
import { view } from '@mcro/black'
import PaneStore from './paneStore'

@view.attach('millerState')
@view.provide({
  paneStore: PaneStore,
})
@view
export default class Pane extends React.Component {
  getRef = ref => {
    this.props.getRef(ref)
  }

  handleRef = ref => {
    if (ref) {
      this.props.millerStore.setWidth(ref.offsetWidth)
    }
  }

  render({ pane, index, width, millerState, type }) {
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <pane css={{ width }} ref={this.handleRef}>
        <ChildPane
          onSelect={row => millerState.setSelection(index, row)}
          getRef={ref => {
            millerState.handlePlugin(index, ref)
          }}
          getRef={this.getRef}
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
  }
}

import * as React from 'react'
import { view } from '@mcro/black'
import PaneStore from './paneStore'

@view.attach('millerState')
@view.provide({
  paneStore: PaneStore,
})
@view
export default class Pane extends React.Component {
  handleRef = ref => {
    const { millerState, index } = this.props
    if (ref) {
      millerState.setPaneWidth(index, ref.offsetWidth)
    }
  }

  render({ pane, paneStore, index, width, millerState, type }) {
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <pane css={{ width }} ref={this.handleRef}>
        <ChildPane
          onSelect={row => millerState.setSelection(index, row)}
          paneStore={paneStore}
          getRef={millerState.handleRef(index)}
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

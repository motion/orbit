import * as React from 'react'
import { view } from '@mcro/black'
import PaneStore from './paneStore'

@view.attach('millerStore')
@view.provide({
  paneStore: PaneStore,
})
@view
export default class Pane extends React.Component {
  handleRef = ref => {
    const { millerStore, index } = this.props
    if (ref) {
      millerStore.setPaneWidth(index, ref.offsetWidth)
    }
  }

  render({ pane, paneStore, index, width, millerStore, type }) {
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <pane css={{ width }} ref={this.handleRef}>
        <ChildPane
          onSelect={row => millerStore.setSelection(index, row)}
          paneStore={paneStore}
          getRef={millerStore.handleRef(index)}
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

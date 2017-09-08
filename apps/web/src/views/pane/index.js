import * as React from 'react'
import { view } from '@mcro/black'
import PaneStore from './paneStore'

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

  render({ pane, paneProps, data, search, width, millerStore, type }) {
    const ChildPane = pane

    if (!ChildPane) {
      console.error('no pane found for type', type)
      return null
    }

    return (
      <pane css={{ width }} ref={this.handleRef}>
        <ChildPane
          paneProps={paneProps}
          data={data || {}}
          millerStore={millerStore}
          getRef={this.getRef}
          search={search}
          selectedIndices={[]}
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

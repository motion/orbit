// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view({
  store: class HighlightsStore {
    highlights = []

    willMount() {
      this.bus = new BroadcastChannel('ora-electron-state')
      this.bus.onmessage = ({ data }) => {
        if (data.context) {
          this.highlights = data.context.highlights || []
        }
      }
      this.subscriptions.add(() => this.bus.close())
    }
  },
})
export default class HighlightsPage {
  render({ store }) {
    const { highlights } = store
    return (
      <highlights $$draggable>
        {store.highlights.map(hl => (
          <highlight key={hl.key} $hlPosition={hl} />
        ))}
      </highlights>
    )
  }

  static style = {
    highlights: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
    },
    highlight: {
      position: 'absolute',
      background: 'red',
    },
    hlPosition: ({ top, left, width, height }) => ({
      top,
      left,
      width,
      height,
    }),
  }
}

// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { OS } from '~/helpers'
import * as Constants from '~/constants'

@view({
  store: class PeekStore {
    highlights = []

    willMount() {
      this.bus = new BroadcastChannel('ora-highlights')
      this.bus.onmessage = ({ data }) => {
        this.highlights = data.highlights
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
        {store.highlights.map(hl => <highlight key={hl.key} $light={hl} />)}
      </highlights>
    )
  }

  static style = {
    highlights: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
    },
    light: ({ top, left, width, height }) => ({
      top,
      left,
      width,
      height,
    }),
  }
}

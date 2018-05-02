import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'
import PeekFrame from './peekFrame'

@view.attach('appStore')
@view
export default class PeekPage {
  render({ appStore }) {
    const { bit } = App.peekState
    const type = (bit && capitalize(bit.type)) || 'Empty'
    const PeekContentsView = PeekContents[type] || PeekContents['Empty']
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    return (
      <UI.Theme name="light">
        <PeekFrame>
          <PeekContentsView
            if={appStore.selectedBit}
            bit={appStore.selectedBit}
            person={appStore.selectedBit}
            appStore={appStore}
          />
        </PeekFrame>
      </UI.Theme>
    )
  }
  ß
}

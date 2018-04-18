import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

@view.attach('appStore')
@view
export default class PeekPage {
  render({ appStore }) {
    const { selectedItem } = App.state
    const type = (selectedItem && capitalize(selectedItem.type)) || 'Empty'
    const PeekContentsView = PeekContents[type] || PeekContents['Empty']
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    console.log('rendering peek', selectedItem)
    return (
      <UI.Theme name="tan">
        <PeekContentsView
          bit={appStore.selectedBit}
          person={appStore.selectedBit}
          selectedItem={selectedItem}
          appStore={appStore}
        />
      </UI.Theme>
    )
  }
}

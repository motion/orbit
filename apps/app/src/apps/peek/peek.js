import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

@view.attach('appStore')
@view
export default class PeekPage {
  render({ appStore }) {
    const { selectedItem } = App.state
    if (!selectedItem) {
      return null
    }
    const type = (selectedItem && capitalize(selectedItem.type)) || 'Empty'
    const PeekContentsView = PeekContents[type] || PeekContents['Empty']
    log(`peek type ${type}`)
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    const { fullScreen } = Electron.orbitState
    if (!selectedItem && !fullScreen) {
      return null
    }
    return (
      <UI.Theme name="tan">
        <PeekContentsView
          bit={appStore.selectedBit}
          selectedItem={selectedItem}
          appStore={appStore}
        />
      </UI.Theme>
    )
  }
}

import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { Bit } from '@mcro/models'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

class PeekStore {
  @watch
  bit = () =>
    App.state.selectedItem && Bit.findOne({ id: App.state.selectedItem.id })
}

@view.attach('appStore')
@view({
  peekStore: PeekStore,
})
export default class PeekPage {
  render({ appStore, peekStore }) {
    const { selectedItem } = App.state
    const type = (selectedItem && capitalize(selectedItem.type)) || 'Empty'
    const PeekContentsView = PeekContents[type] || PeekContents['Empty']
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
          bit={peekStore.bit}
          selectedItem={selectedItem}
          appStore={appStore}
        />
      </UI.Theme>
    )
  }
}

// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import r2 from '@mcro/r2'

@view({
  peekContents: class PeekContentsStore {
    @watch
    selectedContents = () =>
      this.selectedPath
        ? r2.get(`/contents${this.selectedPath}`).json.then(x => x.file)
        : null

    get selectedPath() {
      const selected = App.state.selectedItem
      if (!selected.id) {
        return null
      }
      return selected.id
    }
  },
})
export default class PeekContents {
  render({ peekContents }) {
    const peek = Electron.currentPeek
    console.log(peekContents.selectedContents)
    return (
      <peekContents>
        got a peek:<br />
        {JSON.stringify(peek)}
        <br />
        selected item:<br />
        {JSON.stringify(App.state.selectedItem || {})}
        <content if={peekContents.selectedContents}>
          {JSON.stringify(peekContents.selectedContents || {})}
        </content>
      </peekContents>
    )
  }
}

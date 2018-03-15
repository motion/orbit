// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
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
      if (!selected) return null
      if (!selected.id || (selected.id && selected.id.indexOf('.txt') === -1)) {
        return null
      }
      return selected.id
    }
  },
})
export default class PeekContents {
  render({ peekContents }) {
    const { selectedItem } = App.state
    return (
      <peekContents>
        <UI.Title size={2} fontWeight={700}>
          {selectedItem.id}
        </UI.Title>
        <content if={peekContents.selectedContents}>
          {peekContents.selectedContents}
        </content>
        <content if={!peekContents.selectedContents}>
          <UI.Text size={2}>No contents</UI.Text>
        </content>
      </peekContents>
    )
  }

  static style = {
    peekContents: {
      padding: 20,
      overflow: 'hidden',
      flex: 1,
    },
    content: {
      padding: [10, 0],
      flex: 1,
      maxHeight: '100%',
      overflowY: 'scroll',
    },
  }
}

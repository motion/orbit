// @flow
import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import r2 from '@mcro/r2'

const EmptyContents = ({ item }) => (
  <pane css={{ flex: 1 }}>
    <img
      if={item.icon}
      src={`/icons/${item.icon}`}
      css={{ width: 64, height: 64 }}
    />
    <UI.Title size={2} fontWeight={600}>
      {item.title}
    </UI.Title>
    <UI.Title if={item.subtitle} size={1}>
      {item.subtitle}
    </UI.Title>
    <UI.Text if={item.content} css={{ marginTop: 20 }} size={1}>
      {item.context.map(({ active, text }) => (
        <UI.Text $sentence opacity={active ? 1 : 0.2}>
          {text}
        </UI.Text>
      ))}
    </UI.Text>
  </pane>
)

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
      console.log('selected.id', selected.id)
      return selected.id
    }
  },
})
export default class PeekContents {
  render({ peekContents }) {
    const { selectedItem } = App.state
    return (
      <peekContents>
        <content if={peekContents.selectedContents}>
          <UI.Title size={2} fontWeight={700}>
            {selectedItem.id}
          </UI.Title>
          {peekContents.selectedContents}
        </content>
        <content if={!peekContents.selectedContents}>
          <EmptyContents if={selectedItem} item={selectedItem} />
          <EmptyContents if={!selectedItem} item={{ title: App.state.query }} />
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

import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
// import r2 from '@mcro/r2'

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

// ({
//   store: class PeekContentsStore {
//     // this.selectedPath
//     //   ? r2.get(`/contents${this.selectedPath}`).json.then(x => x.file)
//     //   : null

//     get selectedPath() {
//       const selected = App.state.selectedItem
//       if (!selected) return null
//       if (!selected.id || (selected.id && selected.id.indexOf('.txt') === -1)) {
//         return null
//       }
//       console.log('selected.id', selected.id)
//       return selected.id
//     }
//   },
// })

@view
export default class PeekContents {
  render({ peek: { peekItem } }) {
    const { selectedItem } = App.state
    return (
      <peekContents>
        <section if={peekItem}>
          <contents>{peekItem.body}</contents>
        </section>
        <section if={!peekItem}>
          <EmptyContents if={selectedItem} item={selectedItem} />
          <EmptyContents if={!selectedItem} item={{ title: App.state.query }} />
        </section>
      </peekContents>
    )
  }

  static style = {
    peekContents: {
      padding: 0,
      overflow: 'hidden',
      flex: 1,
    },
    section: {
      padding: [20, 20],
      flex: 1,
      maxHeight: '100%',
      overflowY: 'scroll',
    },
    contents: {
      whiteSpace: 'break',
      textWrap: 'wrap',
    },
  }
}

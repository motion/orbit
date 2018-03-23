import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import PeekHeader from './peekHeader'

const SHADOW_PAD = 15
const background = '#fff'
const peekShadow = [
  [0, 0, SHADOW_PAD, [0, 0, 0, 0.2]],
  [0, 0, 0, 1, [0, 0, 0, 0.05]],
]

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

@view
export default class PeekPage {
  render() {
    const { selectedItem } = App.state
    const { currentPeek } = Electron
    const { fullScreen } = Electron.orbitState
    if (!currentPeek) {
      return null
    }
    const hasDocument = selectedItem && selectedItem.document
    return (
      <UI.Theme name="light">
        <peek
          css={{ paddingLeft: fullScreen ? 0 : 'auto' }}
          $peekVisible={App.isShowingPeek}
        >
          <main>
            <div $$flex if={hasDocument}>
              <PeekHeader title={selectedItem.document.title} />
              <content>{selectedItem.document.text}</content>
              <EmptyContents if={!hasDocument} item={selectedItem} />
            </div>
          </main>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      // transition: 'opacity ease-in 100ms',
      opacity: 0,
      position: 'relative',
      flex: 1,
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
    },
    main: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      boxShadow: peekShadow,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}

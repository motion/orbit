import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import PeekHeader from './peekHeader'
import { SHADOW_PAD, APP_SHADOW } from '~/constants'

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

@UI.injectTheme
@view
export default class PeekPage {
  render({ theme }) {
    const { selectedItem } = App
    const { currentPeek } = Electron
    const { fullScreen } = Electron.orbitState
    if (!currentPeek) {
      return null
    }
    const hasDocument = selectedItem && selectedItem.document
    const border = fullScreen
      ? [1, theme.base.background.darken(0.1).desaturate(0.3)]
      : null
    return (
      <UI.Theme name="tan">
        <peek
          css={{
            paddingLeft: fullScreen ? 0 : SHADOW_PAD,
          }}
          $peekVisible={App.isShowingPeek}
        >
          <main
            css={{
              boxShadow: [
                APP_SHADOW,
                fullScreen ? null : ['inset', 0, 0, 0, 1, [0, 0, 0, 0.05]],
              ].filter(Boolean),
              borderRightRadius: fullScreen ? 5 : 0,
              background: fullScreen ? theme.base.background : '#fff',
              border,
              borderLeft: fullScreen ? 'none' : border,
            }}
          >
            <div $$flex if={hasDocument}>
              <PeekHeader title={selectedItem.document.title} />
              <content
                dangerouslySetInnerHTML={{
                  __html: (selectedItem.document.text || '').replace(
                    '\n',
                    '<br />',
                  ),
                }}
              />
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
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
    content: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
  }
}

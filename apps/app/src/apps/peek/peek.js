import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW, BORDER_RADIUS } from '~/constants'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

console.log('PeekContents', PeekContents)

@UI.injectTheme
@view
export default class PeekPage {
  render({ theme }) {
    const { selectedItem } = App.state
    let type = 'Empty'
    if (selectedItem) {
      type = capitalize(selectedItem.type) || 'Empty'
    }
    const PeekContentsView = PeekContents[type]
    if (!PeekContentsView) {
      console.error('none', type)
      return <peek>no pane found</peek>
    }
    // const { currentPeek } = Electron
    const { fullScreen } = Electron.orbitState
    if (!selectedItem && !fullScreen) {
      return null
    }
    return (
      <UI.Theme name="tan">
        <peek
          css={{
            paddingLeft: fullScreen ? 0 : SHADOW_PAD,
          }}
          $animate={fullScreen || App.isShowingPeek}
          $peekVisible={App.isShowingPeek}
        >
          <main
            css={{
              boxShadow: [
                APP_SHADOW,
                fullScreen ? null : ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]],
              ].filter(Boolean),
              borderRightRadius: fullScreen ? BORDER_RADIUS : 0,
              background: fullScreen ? theme.base.background : '#fff',
            }}
          >
            <PeekContentsView item={selectedItem} />
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
      opacity: 0,
      position: 'relative',
      transition: 'transform linear 80ms',
      flex: 1,
      transform: {
        y: -20,
      },
    },
    animate: {
      transform: {
        y: 0,
      },
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
    },
    main: {
      flex: 1,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}

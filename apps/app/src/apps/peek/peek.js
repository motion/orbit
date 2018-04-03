import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW, BORDER_RADIUS } from '~/constants'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

@UI.injectTheme
@view
export default class PeekPage {
  render({ theme }) {
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
    const onLeft = !fullScreen && Electron.peekState.peekOnLeft
    return (
      <UI.Theme name="tan">
        <peek
          css={{
            overflow: 'hidden',
            paddingLeft: fullScreen ? 0 : SHADOW_PAD,
            marginRight: fullScreen ? 0 : !onLeft ? SHADOW_PAD : -SHADOW_PAD,
          }}
          $animate={App.isShowingPeek}
          $peekVisible={App.isShowingPeek}
        >
          <main
            css={{
              marginRight: fullScreen ? 0 : !onLeft ? -SHADOW_PAD : 0,
              marginLeft: fullScreen ? 0 : !onLeft ? SHADOW_PAD : 0,
              boxShadow: [
                APP_SHADOW,
                fullScreen ? null : ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]],
              ].filter(Boolean),
              borderRightRadius: fullScreen ? BORDER_RADIUS : 0,
              background: fullScreen ? theme.base.background : '#fff',
            }}
          >
            <PeekContentsView bit={selectedItem} item={selectedItem} />
            {JSON.stringify(selectedItem)}
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
        y: -8,
      },
    },
    animate: {
      opacity: 1,
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

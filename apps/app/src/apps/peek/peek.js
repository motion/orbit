import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW } from '~/constants'
import * as PeekContents from './peekContents'
import { capitalize } from 'lodash'

console.log('PeekContents', PeekContents)

@UI.injectTheme
@view
export default class PeekPage {
  render({ theme }) {
    const { peekTarget } = App.state
    let type = 'Empty'
    if (peekTarget) {
      type = capitalize(peekTarget.type) || 'Empty'
    }
    const View = PeekContents[type]
    const { currentPeek } = Electron
    const { fullScreen } = Electron.orbitState
    if (!peekTarget && !fullScreen) {
      return null
    }
    if (!currentPeek) {
      return null
    }
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
            <View item={currentPeek} />
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
      flex: 1,
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

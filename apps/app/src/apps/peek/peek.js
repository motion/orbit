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
                fullScreen ? null : ['inset', 0, 0, 0, 1, [0, 0, 0, 0.5]],
              ].filter(Boolean),
              borderRightRadius: fullScreen ? 5 : 0,
              background: fullScreen ? '#fff' || theme.base.background : '#fff',
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

import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW, BORDER_RADIUS } from '~/constants'

const Space = () => <div css={{ width: SHADOW_PAD, height: '100%' }} />

@UI.injectTheme
@view
export default class PeekFrame {
  render({ children, theme, ...props }) {
    const { selectedItem } = App.state
    const { fullScreen } = Electron.orbitState
    if (!selectedItem && !fullScreen) {
      return null
    }
    const onLeft = Electron.peekOnLeft
    // log(`onleft`, onLeft)
    // const { isShowingPeek } = App
    const isShowingPeek = true
    return (
      <container $$row $$flex>
        <Space if={onLeft} />
        <crop css={{ flex: 1, padding: [SHADOW_PAD, 0], overflow: 'hidden' }}>
          <peek $animate={isShowingPeek} $peekVisible={isShowingPeek}>
            <main
              css={{
                boxShadow: [
                  APP_SHADOW,
                  fullScreen ? null : ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]],
                ].filter(Boolean),
                borderRightRadius: fullScreen ? BORDER_RADIUS : 0,
                background: fullScreen ? theme.base.background : '#fff',
              }}
              {...props}
            >
              {children}
            </main>
          </peek>
        </crop>
        <Space if={!onLeft} />
      </container>
    )
  }

  static style = {
    peek: {
      alignSelf: 'flex-end',
      height: '100%',
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

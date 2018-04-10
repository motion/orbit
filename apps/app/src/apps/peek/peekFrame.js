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
    const onRight = !Electron.peekOnLeft
    // log(`onRight`, onLeft)
    const { isShowingPeek } = App
    // const isShowingPeek = true
    return (
      <container $$row $$flex>
        <Space if={onRight} />
        <crop
          css={{
            flex: 1,
            padding: fullScreen
              ? [SHADOW_PAD, SHADOW_PAD, SHADOW_PAD, 0]
              : [
                  SHADOW_PAD,
                  onRight ? SHADOW_PAD : 0,
                  SHADOW_PAD,
                  !onRight ? SHADOW_PAD : 0,
                ],
            overflow: 'hidden',
          }}
        >
          <peek $animate={isShowingPeek} $peekVisible={isShowingPeek}>
            <main
              css={{
                boxShadow: [
                  APP_SHADOW,
                  fullScreen ? null : ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]],
                ].filter(Boolean),
                borderRightRadius: fullScreen || onRight ? BORDER_RADIUS : 0,
                borderLeftRadius: !onRight ? BORDER_RADIUS : 0,
                background: fullScreen
                  ? theme.base.background.lighten(0.05)
                  : theme.base.background,
              }}
              {...props}
            >
              {children}
              <undoBorder
                css={{
                  background: theme.base.background,
                  width: 1,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  // left: onRight ? 0 : 'auto',
                  right: !onRight ? 0 : 'auto',
                }}
              />
              <opposeShadow
                css={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 7,
                  background: `linear-gradient(to right, transparent, #fff)`,
                  zIndex: 10000,
                }}
              />
            </main>
          </peek>
        </crop>
        <Space if={!onRight} />
      </container>
    )
  }

  static style = {
    peek: {
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

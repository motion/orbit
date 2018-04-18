import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW, BORDER_RADIUS } from '~/constants'
import WindowControls from '~/views/windowControls'

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
    const { isShowingPeek } = App
    const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]]
    const borderRightRadius = fullScreen || onRight ? BORDER_RADIUS : 0
    const borderLeftRadius = !fullScreen && !onRight ? BORDER_RADIUS : 0
    return (
      <container $$row $$flex>
        <Space if={!onRight} />
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
            <WindowControls
              css={{
                position: 'absolute',
                top: 20,
                zIndex: 10000,
                ...(Electron.peekOnLeft
                  ? {
                      right: 10,
                    }
                  : {
                      left: 20,
                    }),
              }}
              onClose={() => {
                App.setPeekTarget(null)
              }}
            />
            <peekFrameBorder
              css={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRightRadius,
                borderLeftRadius,
                zIndex: 10000,
                pointerEvents: 'none',
                border: [2, '#fff'],
              }}
            />
            <main
              css={{
                boxShadow: fullScreen
                  ? [APP_SHADOW, borderShadow]
                  : [[0, 0, SHADOW_PAD, [0, 0, 0, 0.08]], borderShadow],
                // make shadow go under
                marginLeft: fullScreen ? -SHADOW_PAD : 0,
                paddingLeft: fullScreen ? SHADOW_PAD : 0,
                borderRightRadius,
                borderLeftRadius,
                background: `radial-gradient(#fff 70%, ${
                  theme.base.background
                }`,
              }}
              {...props}
            >
              {children}
            </main>
          </peek>
        </crop>
        <Space if={onRight} />
      </container>
    )
  }

  static style = {
    container: {
      // background: 'red',
    },
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

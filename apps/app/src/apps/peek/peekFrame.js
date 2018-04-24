import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { BORDER_RADIUS } from '~/constants'
import WindowControls from '~/views/windowControls'

const SHADOW_PAD = 60

@UI.injectTheme
@view
export default class PeekFrame {
  render({ children, theme, ...props }) {
    const { peekState } = Electron
    const { selectedItem } = App.state
    const { fullScreen } = Electron.orbitState
    if (!selectedItem && !fullScreen) {
      return null
    }
    const onRight = !peekState.peekOnLeft
    const { isShowingPeek } = App
    const borderRightRadius = fullScreen || onRight ? BORDER_RADIUS : 0
    const borderLeftRadius = !fullScreen && !onRight ? BORDER_RADIUS : 0
    const padding = [
      SHADOW_PAD,
      onRight ? SHADOW_PAD : 0,
      SHADOW_PAD,
      !onRight ? SHADOW_PAD : 0,
    ]
    const margin = padding.map(x => -x)
    const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.3]]
    const boxShadow = [[0, 0, SHADOW_PAD, [0, 0, 0, 0.2]], borderShadow]
    return (
      <peekFrame
        css={{
          width: peekState.size[0],
          height: peekState.size[1] + SHADOW_PAD,
          transform: {
            x: peekState.position[0],
            y: peekState.position[1],
          },
        }}
      >
        <crop
          css={{
            padding,
            margin,
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
                borderRightRadius,
                borderLeftRadius,
              }}
            />
            <peekMain
              css={{
                boxShadow,
                // make shadow go under
                // marginLeft: fullScreen ? -SHADOW_PAD : 0,
                // paddingLeft: fullScreen ? SHADOW_PAD : 0,
                borderRightRadius,
                borderLeftRadius,
                background: `radial-gradient(#fff 70%, ${
                  theme.base.background
                }`,
              }}
              {...props}
            >
              {children}
            </peekMain>
          </peek>
        </crop>
      </peekFrame>
    )
  }

  static style = {
    peekFrame: {
      // background: [0, 0, 0, 0.5],
      flexFlow: 'row',
      flex: 1,
    },
    peek: {
      pointerEvents: 'none !important',
      opacity: 0,
      position: 'relative',
      transition: 'transform linear 80ms',
      flex: 1,
      transform: {
        y: -8,
      },
    },
    crop: {
      overflow: 'hidden',
      flex: 1,
      height: '100%',
    },
    animate: {
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    peekFrameBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      pointerEvents: 'none',
      border: [2, '#fff'],
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
    },
    peekMain: {
      flex: 1,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}

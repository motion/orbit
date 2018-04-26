import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import WindowControls from '~/views/windowControls'

const SHADOW_PAD = 50
const BORDER_RADIUS = 5
const background = '#f9f9f9'

@UI.injectTheme
@view
export default class PeekFrame {
  render({ children, theme, ...props }) {
    const { peekState } = Electron
    const { selectedItem, peekTarget } = App.state
    const { fullScreen } = Electron.orbitState
    if ((!selectedItem && !fullScreen) || !peekTarget) {
      return null
    }
    const onRight = !peekState.peekOnLeft
    const { isShowingPeek } = App
    const borderRightRadius =
      fullScreen || onRight ? BORDER_RADIUS : BORDER_RADIUS
    const borderLeftRadius =
      !fullScreen && !onRight ? BORDER_RADIUS : BORDER_RADIUS
    const padding = [
      SHADOW_PAD,
      onRight ? SHADOW_PAD : 0,
      SHADOW_PAD,
      !onRight ? SHADOW_PAD : 0,
    ]
    const margin = padding.map(x => -x)
    const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.3]]
    const boxShadow = [
      [onRight ? 6 : -6, 3, SHADOW_PAD, [0, 0, 0, 0.15]],
      borderShadow,
    ]
    const arrowSize = 40
    const peekOverlapOrbitPx = onRight ? -4 : 4
    return (
      <peekFrame
        css={{
          width: peekState.size[0],
          height: peekState.size[1] + SHADOW_PAD,
          transition: 'all ease-in 300ms',
          transform: {
            x: peekState.position[0] + peekOverlapOrbitPx,
            y: peekState.position[1],
          },
        }}
      >
        <UI.Arrow
          size={arrowSize}
          towards={onRight ? 'left' : 'right'}
          background={background}
          boxShadow={[
            [0, 0, 10, [0, 0, 0, 0.05]],
            ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.25]],
          ]}
          css={{
            position: 'absolute',
            top:
              peekState.position[1] +
              (peekState.position[1] - peekTarget.position.top),
            left: !onRight ? 'auto' : -30,
            right: !onRight ? -40 : 'auto',
            zIndex: 100,
            transform: {
              x: onRight ? 0.5 : -0.5,
            },
          }}
        />
        <crop
          css={{
            padding,
            margin,
          }}
        >
          <peek $animate={isShowingPeek} $peekVisible={isShowingPeek}>
            <WindowControls
              if={false}
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
                borderRightRadius,
                borderLeftRadius,
                background,
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
      position: 'relative',
      zIndex: 1000,
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
      // overflow: 'hidden',
      flex: 1,
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

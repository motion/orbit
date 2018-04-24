import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { SHADOW_PAD, APP_SHADOW, BORDER_RADIUS } from '~/constants'
import WindowControls from '~/views/windowControls'
import peekPosition from './peekPosition'

const Space = () => <div css={{ width: SHADOW_PAD, height: '100%' }} />

class PeekFrameStore {
  @react
  peekPosition = [
    () => App.state.peekTarget,
    peekTarget => {
      if (!peekTarget) return
      if (Electron.orbitState.fullScreen) {
        return
      }
      return peekPosition(peekTarget.position)
    },
  ]
}

@UI.injectTheme
@view.provide({
  peekFrame: PeekFrameStore,
})
@view
export default class PeekFrame {
  render({ peekFrame, children, theme, ...props }) {
    if (!peekFrame.peekPosition) {
      return null
    }
    const { peekPosition } = peekFrame
    const { selectedItem } = App.state
    const { fullScreen } = Electron.orbitState
    if (!selectedItem && !fullScreen) {
      return null
    }
    const onRight = !peekPosition.peekOnLeft
    const { isShowingPeek } = App
    const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.15]]
    const borderRightRadius = fullScreen || onRight ? BORDER_RADIUS : 0
    const borderLeftRadius = !fullScreen && !onRight ? BORDER_RADIUS : 0
    return (
      <peekFrame
        css={{
          width: peekPosition.size[0],
          height: peekPosition.size[1],
          transform: {
            x: peekPosition.position[0],
            y: peekPosition.position[1],
          },
        }}
      >
        <Space if={!onRight} />
        <crop
          css={{
            padding: fullScreen
              ? [SHADOW_PAD, SHADOW_PAD, SHADOW_PAD, 0]
              : [
                  SHADOW_PAD,
                  onRight ? SHADOW_PAD : 0,
                  SHADOW_PAD,
                  !onRight ? SHADOW_PAD : 0,
                ],
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
            </peekMain>
          </peek>
        </crop>
        <Space if={onRight} />
      </peekFrame>
    )
  }

  static style = {
    peekFrame: {
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

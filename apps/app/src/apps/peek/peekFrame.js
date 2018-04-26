import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import WindowControls from '~/views/windowControls'
import { isEqual } from 'lodash'

const SHADOW_PAD = 50
const BORDER_RADIUS = 6
const background = '#f9f9f9'

class PeekFrameStore {
  get nextState() {
    return {
      target: App.state.peekTarget,
      ...Electron.peekState,
    }
  }

  @react({ delay: 100 })
  curState = [() => this.nextState, _ => _]

  get willShow() {
    return this.curState && !isEqual(this.nextState, this.curState)
  }
}

@UI.injectTheme
@view({
  store: PeekFrameStore,
})
export default class PeekFrame {
  render({ store, children, ...props }) {
    const { nextState, willShow } = store
    if (
      !nextState.position ||
      !nextState.position.length ||
      !nextState.target
    ) {
      return null
    }
    const { fullScreen, orbitDocked } = Electron.orbitState
    const onRight = !nextState.peekOnLeft
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
    const arrowSize = 33
    let peekAdjustX = orbitDocked ? 13 : 0
    peekAdjustX += onRight ? -4 : 4
    return (
      <peekFrame
        css={{
          background: willShow ? 'red' : 'transparent',
          opacity: willShow ? 0 : 1,
          width: nextState.size[0],
          height: nextState.size[1] + SHADOW_PAD,
          transition: 'all ease-in 300ms',
          transform: {
            x: nextState.position[0] + peekAdjustX,
            y: nextState.position[1],
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
              nextState.position[1] +
              (nextState.position[1] - nextState.target.position.top),
            left: !onRight ? 'auto' : -30,
            right: !onRight ? -arrowSize : 'auto',
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
      zIndex: 2,
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

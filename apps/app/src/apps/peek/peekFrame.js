import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import WindowControls from '~/views/windowControls'
import * as Constants from '~/constants'

const SHADOW_PAD = 50
const borderRadius = 6
const background = '#f9f9f9'

class PeekFrameStore {
  @react
  curState = [
    () => App.state.peekTarget,
    async (target, { whenChanged }) => {
      if (!target) {
        return null
      }
      // wait for related peek state
      await whenChanged(() => Electron.peekState.id)
      return {
        target,
        ...Electron.peekState,
      }
    },
  ]

  @react({ delay: 100, fireImmediately: true, log: false })
  lastState = [() => this.curState, _ => _]

  get willHide() {
    return !!this.lastState && !this.curState
  }

  get willShow() {
    return !!this.curState && !this.lastState
  }

  get willStayShown() {
    return !!this.lastState && !!this.curState
  }
}

@UI.injectTheme
@view({
  store: PeekFrameStore,
})
export default class PeekFrame {
  render({ store, children, ...props }) {
    const { willShow, willHide, curState, lastState, willStayShown } = store
    let state = curState
    if (willHide) {
      state = lastState
    }
    if (!state || !state.position || !state.position.length) {
      return null
    }
    const isHidden = !state
    const { orbitDocked, orbitOnLeft } = Electron.orbitState
    const onRight = !state.peekOnLeft
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
    peekAdjustX += onRight ? -4 + (!orbitOnLeft ? Constants.SHADOW_PAD : 0) : 4
    return (
      <peekFrame
        css={{
          transition: isHidden
            ? 'none'
            : willHide ? 'all ease-in 200ms' : 'all ease-in 150ms',
          opacity: isHidden || (willShow && !willStayShown) ? 0 : 1,
          width: state.size[0],
          height: state.size[1],
          transform: {
            x: state.position[0] + peekAdjustX,
            y: state.position[1] + (willShow && !willStayShown ? -8 : 0),
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
          $arrow
          css={{
            left: !onRight ? 'auto' : -23,
            right: !onRight ? -arrowSize : 'auto',
            transform: {
              y: isHidden
                ? 0
                : state.target.position.top +
                  state.target.position.height / 2 -
                  state.position[1] -
                  arrowSize / 2,
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
          <peek>
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
                borderRadius,
              }}
            />
            <peekMain
              css={{
                boxShadow,
                borderRadius,
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
      position: 'absolute',
      left: 0,
      zIndex: 2,
    },
    peek: {
      pointerEvents: 'all !important',
      position: 'relative',
      flex: 1,
    },
    crop: {
      // overflow: 'hidden',
      flex: 1,
    },
    arrow: {
      position: 'absolute',
      top: 0,
      zIndex: 100,
      transition: 'transform ease-in 100ms',
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
    peekMain: {
      flex: 1,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
    },
  }
}

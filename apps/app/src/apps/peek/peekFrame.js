import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import WindowControls from '~/views/windowControls'
import * as Constants from '~/constants'

const SHADOW_PAD = 50
const borderRadius = 8
const background = '#f9f9f9'

class PeekFrameStore {
  get curState() {
    if (!App.peekState.target) {
      return null
    }
    if (App.orbitState.docked || !App.orbitState.hidden) {
      return App.peekState
    }
    return null
  }

  @react({ delay: 16, fireImmediately: true, log: false })
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

const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.3]]

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
    if (!state || !state.position || !state.position.length || !state.target) {
      return null
    }
    const isHidden = !state
    const { docked, orbitOnLeft } = App.orbitState
    const onRight = !state.peekOnLeft
    const padding = [
      SHADOW_PAD,
      onRight ? SHADOW_PAD : 0,
      SHADOW_PAD,
      !onRight ? SHADOW_PAD : 0,
    ]
    const margin = padding.map(x => -x)
    const boxShadow = [
      [onRight ? 6 : -6, 3, SHADOW_PAD, [0, 0, 0, 0.15]],
      borderShadow,
    ]
    const arrowSize = 30
    // determine x adjustments
    // adjust for docked not using shadow pad
    let peekAdjustX = docked ? -18 : 0
    // adjust for orbit arrow blank
    if (!docked && orbitOnLeft && !onRight) {
      peekAdjustX -= Constants.SHADOW_PAD
    }
    // small adjust to overlap
    peekAdjustX += onRight ? -2 : 2
    const x = state.position[0] + peekAdjustX
    const animationAdjust = (willShow && !willStayShown) || willHide ? -8 : 0
    const y = state.position[1] + animationAdjust
    const ARROW_CARD_TOP_OFFSET = 60
    const arrowY = Math.min(
      isHidden
        ? 0
        : state.target.top +
          ARROW_CARD_TOP_OFFSET -
          state.position[1] -
          arrowSize / 2,
      state.size[1] - borderRadius * 2 - arrowSize,
    )
    return (
      <peekFrame
        css={{
          transition: isHidden
            ? 'none'
            : willHide ? 'all ease-in 200ms' : 'all ease-in 150ms',
          opacity: isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
          width: state.size[0],
          height: state.size[1],
          transform: {
            x,
            y,
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
            left: !onRight ? 'auto' : -20,
            right: !onRight ? -arrowSize : 'auto',
            transform: {
              y: arrowY,
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
              css={{
                position: 'absolute',
                top: 11,
                right: 0,
                zIndex: 10000,
                transform: {
                  scale: 0.9,
                },
              }}
              onClose={App.clearPeek}
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

import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import { WindowControls } from '~/views/windowControls'
import * as Constants from '~/constants'

const SHADOW_PAD = 50
const borderRadius = 8
const background = '#f9f9f9'

const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.3]]
const transitions = store => {
  if (store.isHidden) return 'none'
  if (store.willHide) return 'all ease-in 200ms'
  if (store.willStayShown) return 'all ease-in 120ms'
  return 'all ease-in 150ms'
}

@view.attach('peekStore')
@view
export class PeekFrame {
  render({ peekStore, children, ...props }) {
    const { willShow, willHide, state, willStayShown } = peekStore
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
    const boxShadow = [[onRight ? 6 : -6, 3, SHADOW_PAD, [0, 0, 0, 0.15]]]
    const arrowSize = 24
    // determine x adjustments
    // adjust for docked not using shadow pad
    let peekAdjustX = docked ? -18 - 6 : 0
    // adjust for orbit arrow blank
    if (!docked && orbitOnLeft && !onRight) {
      peekAdjustX -= Constants.SHADOW_PAD
    }
    // small adjust to overlap
    peekAdjustX += onRight ? -2 : 2
    const x = state.position[0] + peekAdjustX
    const animationAdjust = (willShow && !willStayShown) || willHide ? -8 : 0
    const y = state.position[1] + animationAdjust
    const ARROW_CARD_TOP_OFFSET = 32
    const arrowY = Math.min(
      isHidden
        ? 0
        : state.target.top +
          ARROW_CARD_TOP_OFFSET -
          state.position[1] -
          arrowSize / 2,
      state.size[1] - borderRadius * 2 - arrowSize,
    )
    const transition = transitions(peekStore)
    return (
      <peekFrame
        css={{
          transition,
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
            left: !onRight ? 'auto' : -14,
            right: !onRight ? -arrowSize : 'auto',
            zIndex: 1000000000,
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
            <chrome
              if={peekStore.hasHistory}
              css={{ top: peekStore.headerHeight - 11 }}
            >
              <UI.Button
                icon="arrowminleft"
                circular
                size={0.85}
                background="#f2f2f2"
                iconProps={{
                  style: {
                    transform: 'translateX(-1px) translateY(-1px)',
                  },
                }}
              />
            </chrome>
            <peekFrameBorder
              css={{
                borderRadius,
                boxShadow: [borderShadow],
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
    chrome: {
      position: 'absolute',
      left: 10,
      zIndex: 100000,
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

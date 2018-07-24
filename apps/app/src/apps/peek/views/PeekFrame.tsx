import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'

const SHADOW_PAD = 80
const borderRadius = 6
const background = '#f9f9f9'
// shared by arrow and frameborder
const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.7]]

const transitions = store => {
  if (store.isHidden) return 'none'
  if (store.tornState) return 'all linear 10ms'
  if (store.willHide) return 'all ease 200ms'
  if (store.willStayShown) return 'all ease 90ms'
  return 'all ease 150ms'
}

const PeekFrameBorder = view(UI.FullScreen, {
  zIndex: 10000,
  pointerEvents: 'none',
  boxShadow: [borderShadow, ['inset', 0, 0.5, 0, 1, [255, 255, 255, 0.3]]],
})

const PeekMain = view({
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
  transition: 'background ease-in 200ms',
})

type PeekFrameProps = {
  peekStore: PeekStore
  children: any
}

export const PeekFrame = view.attach('peekStore')(
  attachTheme(
    view(({ peekStore, children, ...props }: PeekFrameProps) => {
      const {
        willShow,
        willHide,
        state,
        willStayShown,
        framePosition,
      } = peekStore
      if (
        !state ||
        !state.position ||
        !state.position.length ||
        !state.target
      ) {
        return null
      }
      const isHidden = !state
      const onRight = !state.peekOnLeft
      const padding = [
        SHADOW_PAD,
        onRight ? SHADOW_PAD : 0,
        SHADOW_PAD,
        !onRight ? SHADOW_PAD : 0,
      ]
      const margin = padding.map(x => -x)
      const boxShadow = [[onRight ? 6 : -6, 8, SHADOW_PAD, [0, 0, 0, 0.2]]]
      const arrowSize = 20
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
        <UI.Col
          position="absolute"
          left={0}
          zIndex={2}
          {...{
            transition,
            opacity:
              isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
            width: state.size[0],
            height: state.size[1],
            transform: {
              x: framePosition[0],
              y: framePosition[1],
            },
          }}
        >
          <UI.Arrow
            if={!peekStore.tornState}
            position="absolute"
            top={0}
            zIndex={100}
            transition="transform ease-in 100ms"
            size={arrowSize}
            towards={onRight ? 'left' : 'right'}
            background={
              arrowY < 40 && peekStore.theme
                ? UI.color(peekStore.theme.background).darken(0.2)
                : background
            }
            boxShadow={[[0, 0, 10, [0, 0, 0, 0.05]], borderShadow]}
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
          <UI.Col flex={1} padding={padding} margin={margin}>
            <UI.Col pointerEvents="all !important" position="relative" flex={1}>
              <PeekFrameBorder borderRadius={borderRadius} />
              <PeekMain
                css={{
                  boxShadow,
                  borderRadius,
                  // background,
                }}
                {...props}
              >
                {children}
              </PeekMain>
            </UI.Col>
          </UI.Col>
        </UI.Col>
      )
    }),
  ),
)

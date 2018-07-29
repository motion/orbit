import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { PeekFrameArrow } from './PeekFrameArrow'

const SHADOW_PAD = 85
// shared by arrow and frameborder
const borderShadow = ['inset', 0, 0, 0, 0.5, [0, 0, 0, 0.5]]

const transitions = store => {
  if (store.isHidden) return 'none'
  if (store.tornState) return 'all linear 10ms'
  if (store.willHide) return 'all ease 200ms'
  if (store.willStayShown) return 'all ease 200ms'
  return 'opacity ease 100ms, transform ease 100ms'
}

const PeekFrameBorder = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  borderRadius: Constants.PEEK_BORDER_RADIUS,
  pointerEvents: 'none',
  boxShadow: [borderShadow, ['inset', 0, 0.5, 0, 0.5, [255, 255, 255, 0.3]]],
})

const PeekMain = view({
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
})

PeekMain.theme = ({ theme }) => ({
  background: theme.base.background,
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
      const boxShadow = [[onRight ? 6 : -6, 8, SHADOW_PAD, [0, 0, 0, 0.3]]]
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
          {!peekStore.tornState && (
            <PeekFrameArrow peekStore={peekStore} borderShadow={borderShadow} />
          )}
          <UI.Col flex={1} padding={padding} margin={margin}>
            <UI.Col pointerEvents="all !important" position="relative" flex={1}>
              <PeekFrameBorder />
              <PeekMain
                css={{
                  boxShadow,
                  borderRadius: Constants.PEEK_BORDER_RADIUS,
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

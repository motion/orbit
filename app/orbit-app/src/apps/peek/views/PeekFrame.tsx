import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { PeekFrameArrow } from './PeekFrameArrow'
import { ResizableBox } from '../../../views/ResizableBox'
import { App } from '@mcro/stores'
import { attachTheme, ThemeObject } from '@mcro/gloss'

const SHADOW_PAD = 85

const transitions = store => {
  if (store.isHidden) return 'none'
  if (store.tornState) return 'all linear 10ms'
  if (store.willHide) return 'all ease 100ms'
  if (store.willStayShown) return 'all ease 60ms'
  return 'all ease 100ms'
}

const PeekFrameBorder = view(UI.View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  borderRadius: Constants.PEEK_BORDER_RADIUS,
  pointerEvents: 'none',
})

const PeekMain = view(UI.View, {
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
})

type PeekFrameProps = {
  peekStore: PeekStore
  children: any
  theme?: ThemeObject
}

const decorator = compose(
  attachTheme,
  view.attach('peekStore'),
  view,
)

const PeekFrameContainer = view(UI.View, {
  position: 'absolute',
  left: 0,
  zIndex: 2,
})

const handleResize = (_, { size }) => {
  App.setPeekState({ size: [size.width, size.height] })
}

export const PeekFrame = decorator(
  ({ peekStore, children, theme, ...props }: PeekFrameProps) => {
    const {
      isShown,
      willShow,
      willHide,
      state,
      willStayShown,
      framePosition,
    } = peekStore
    if (!state || !state.position || !state.position.length || !state.target) {
      return null
    }
    const borderShadow = ['inset', 0, 0, 0, 0.5, theme.frameBorderColor]
    const isHidden = !state
    const onRight = !state.peekOnLeft
    const padding = [
      SHADOW_PAD,
      onRight ? SHADOW_PAD : 0,
      SHADOW_PAD,
      !onRight ? SHADOW_PAD : 0,
    ]
    const margin = padding.map(x => -x)
    const boxShadow = [[onRight ? 8 : -8, 8, SHADOW_PAD, [0, 0, 0, 0.35]]]
    const transition = transitions(peekStore)
    const size = App.peekState.size
    return (
      <ResizableBox
        width={size[0]}
        height={size[1]}
        minConstraints={[100, 100]}
        maxConstraints={[window.innerWidth, window.innerHeight]}
        onResize={handleResize}
        style={{
          zIndex: 2,
          width: size[0],
          height: size[1],
          transition,
          opacity: isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
          transform: `translateX(${framePosition[0]}px) translateY(${
            framePosition[1]
          }px)`,
        }}
      >
        <PeekFrameContainer
          width={size[0]}
          height={size[1]}
          pointerEvents={isShown ? 'auto' : 'none'}
        >
          {!peekStore.tornState && (
            <PeekFrameArrow peekStore={peekStore} borderShadow={borderShadow} />
          )}
          <UI.Col flex={1} padding={padding} margin={margin}>
            <UI.Col position="relative" flex={1}>
              <PeekFrameBorder boxShadow={[borderShadow]} />
              <PeekMain
                boxShadow={boxShadow}
                borderRadius={Constants.PEEK_BORDER_RADIUS}
                {...props}
              >
                {children}
              </PeekMain>
            </UI.Col>
          </UI.Col>
        </PeekFrameContainer>
      </ResizableBox>
    )
  },
)

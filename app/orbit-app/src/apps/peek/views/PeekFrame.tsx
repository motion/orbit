import * as React from 'react'
import { view, compose, react, ensure } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { PeekFrameArrow } from './PeekFrameArrow'
import { ResizableBox } from '../../../views/ResizableBox'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { setAppState } from '../../../actions/appActions/setAppState'
import { debounce } from 'lodash'
import { Actions } from '../../../actions/Actions'
import { trace } from 'mobx'

type PeekFrameProps = {
  store?: PeekFrameStore
  peekStore: PeekStore
  children: any
  theme?: ThemeObject
}

const SHADOW_PAD = 85

const transitions = (store: PeekStore) => {
  if (store.isTorn) return 'transform linear 10ms'
  if (store.willHide) return 'transform ease 100ms'
  if (store.willStayShown) return 'transform ease 60ms'
  return 'transform ease 100ms'
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

class PeekFrameStore {
  props: PeekFrameProps
  size: [number, number] = [0, 0]

  updateSizeFromAppState = react(
    () => this.props.peekStore.appState.size,
    size => {
      ensure('size', !!size)
      this.size = size
    },
  )

  handleResize = (_, { size }) => {
    this.size = [size.width, size.height]
    this.tearOnFinishResize()
  }

  tearOnFinishResize = debounce(() => {
    if (this.props.peekStore.isPeek) {
      Actions.tearPeek()
    }
  }, 100)

  deferredSetAppState = react(
    () => this.size,
    async (size, { sleep }) => {
      await sleep(100)
      setAppState({ size })
    },
  )
}

const decorator = compose(
  attachTheme,
  view.attach('peekStore'),
  view.attach({
    store: PeekFrameStore,
  }),
  view,
)

const PeekFrameContainer = view(UI.View, {
  // alignItems: 'flex-end',
  position: 'absolute',
  right: 0,
  zIndex: 2,
})

export const PeekFrame = decorator(({ peekStore, store, children, theme }: PeekFrameProps) => {
  const { isShown, willShow, willHide, state, willStayShown, framePosition } = peekStore
  if (!state || !state.position || !state.position.length || !state.target) {
    return null
  }
  const borderShadow = ['inset', 0, 0, 0, 0.5, theme.frameBorderColor]
  const isHidden = !state
  const onRight = !state.peekOnLeft
  const padding = [SHADOW_PAD, onRight ? SHADOW_PAD : 0, SHADOW_PAD, !onRight ? SHADOW_PAD : 0]
  const margin = padding.map(x => -x)
  const boxShadow = [[onRight ? 8 : -8, 8, SHADOW_PAD, [0, 0, 0, 0.35]]]
  const transition = transitions(peekStore)
  const size = store.size
  return (
    <ResizableBox
      width={size[0]}
      height={size[1]}
      minConstraints={[100, 100]}
      maxConstraints={[window.innerWidth, window.innerHeight]}
      onResize={store.handleResize}
      style={{
        zIndex: 2,
        // keep size/positionX linked to be fast...
        width: size[0],
        height: size[1],
        // dont put this in transform so it doesnt animate
        // it needs to move quickly because the frame itself resizes
        // and so it has to update the width + left at same time
        left: framePosition[0],
        // ...but have the positionY animate nicely
        transform: `translateX(0px) translateY(${framePosition[1]}px)`,
        transition,
        opacity: isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
      }}
    >
      <PeekFrameContainer
        width={size[0]}
        height={size[1]}
        pointerEvents={isShown ? 'auto' : 'none'}
      >
        <PeekFrameArrow peekStore={peekStore} borderShadow={borderShadow} />
        <UI.Col flex={1} padding={padding} margin={margin}>
          <UI.Col position="relative" flex={1}>
            <PeekFrameBorder boxShadow={[borderShadow]} />
            <PeekMain boxShadow={boxShadow} borderRadius={Constants.PEEK_BORDER_RADIUS}>
              {children}
            </PeekMain>
          </UI.Col>
        </UI.Col>
      </PeekFrameContainer>
    </ResizableBox>
  )
})

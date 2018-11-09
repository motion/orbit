import * as React from 'react'
import { view, compose, react, ensure, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '../../constants'
import Resizable, { ResizableDirection, ResizeCallback } from 're-resizable'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { debounce } from 'lodash'
import { AppActions } from '../../actions/AppActions'
import { ViewStore } from '../../pages/AppPage/ViewStore'
import { AppFrameArrow } from './AppFrameArrow'

type AppFrameProps = {
  store?: AppFrameStore
  viewStore: ViewStore
  children: any
  theme?: ThemeObject
}

const SHADOW_PAD = 85

const transitions = (store: ViewStore) => {
  if (store.isTorn) return 'transform linear 10ms'
  if (store.willHide) return 'transform ease 100ms'
  if (store.willStayShown) return 'transform ease 60ms'
  return 'transform ease 100ms'
}

const AppFrameBorder = view(UI.View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  borderRadius: Constants.PEEK_BORDER_RADIUS,
  pointerEvents: 'none',
})

const AppMainContent = view(UI.View, {
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
})

class AppFrameStore {
  props: AppFrameProps

  // frame position and size
  sizeD: [number, number] = [0, 0]
  posD: [number, number] = [0, 0]
  syncWithAppState = react(
    () => [this.props.viewStore.appState.size, this.props.viewStore.appState.position],
    ([size, position]) => {
      ensure('size', !!size)
      this.sizeD = size
      this.posD = position
    },
  )

  handleResize: ResizeCallback = (_e, direction, _r, { width, height }) => {
    switch (direction) {
      case 'right':
      case 'bottom':
      case 'bottomRight':
        this.sizeD = [this.sizeD[0] + width, this.sizeD[1] + height]
        break
      case 'top':
      case 'left':
      case 'topLeft':
        this.posD = [this.posD[0] - width, this.posD[1] - height]
        this.sizeD = [this.sizeD[0] + width, this.sizeD[1] + height]
        break
    }

    this.tearOnFinishResize()
  }

  tearOnFinishResize = debounce(() => {
    if (this.props.viewStore.isPeek) {
      AppActions.tearPeek()
    }
  }, 100)

  deferredSetAppState = react(
    () => [this.sizeD, this.posD],
    async ([size, position], { sleep }) => {
      await sleep(100)
      AppActions.setAppState({ size, position })
    },
  )
}

const PeekFrameContainer = view(UI.View, {
  // alignItems: 'flex-end',
  position: 'absolute',
  right: 0,
  zIndex: 2,
})

const decorator = compose(
  attachTheme,
  attach('viewStore'),
  attach({
    store: AppFrameStore,
  }),
  view,
)
export const AppFrame = decorator(({ viewStore, store, children, theme }: AppFrameProps) => {
  const { isShown, willShow, willHide, state, willStayShown, framePosition } = viewStore
  if (!state || !state.position || !state.position.length || !state.target) {
    return null
  }
  const borderShadow = ['inset', 0, 0, 0, 0.5, theme.frameBorderColor]
  const isHidden = !state
  const onRight = !state.peekOnLeft
  const padding = [SHADOW_PAD, onRight ? SHADOW_PAD : 0, SHADOW_PAD, !onRight ? SHADOW_PAD : 0]
  const margin = padding.map(x => -x)
  const boxShadow = [[onRight ? 8 : -8, 8, SHADOW_PAD, [0, 0, 0, 0.35]]]
  const transition = transitions(viewStore)
  const size = store.sizeD
  return (
    <Resizable
      size={{ width: size[0], height: size[1] }}
      minWidth={100}
      minHeight={100}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      onResize={store.handleResize}
      className="resizable"
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
        <AppFrameArrow viewStore={viewStore} borderShadow={borderShadow} />
        <UI.Col flex={1} padding={padding} margin={margin}>
          <UI.Col position="relative" flex={1}>
            <AppFrameBorder boxShadow={[borderShadow]} />
            <AppMainContent
              background={theme.background}
              boxShadow={boxShadow}
              borderRadius={Constants.PEEK_BORDER_RADIUS}
            >
              {children}
            </AppMainContent>
          </UI.Col>
        </UI.Col>
      </PeekFrameContainer>
    </Resizable>
  )
})

import * as React from 'react'
import { view, compose, react, ensure, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '../../constants'
import Resizable, { ResizeCallback } from 're-resizable'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { debounce } from 'lodash'
import { AppActions } from '../../actions/AppActions'
import { AppPageStore } from './AppPageStore'
import { AppFrameArrow } from './AppFrameArrow'
import { App } from '@mcro/stores'

type AppFrameProps = {
  store?: AppFrameStore
  appPageStore: AppPageStore
  children: any
  theme?: ThemeObject
}

const SHADOW_PAD = 85

const transitions = (store: AppPageStore) => {
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

const initialAppState = App.getAppState(Constants.APP_ID)

class AppFrameStore {
  props: AppFrameProps

  // frame position and size
  sizeD = initialAppState.size
  posD = initialAppState.position

  get framePosition() {
    const { willShow, willStayShown, willHide, state, dragOffset } = this.props.appPageStore
    if (!state || !state.position) {
      return [0, 0]
    }
    // determine x adjustments
    const animationAdjust = (willShow && !willStayShown) || willHide ? -6 : 0
    const position = state.position
    let x = position[0]
    let y = position[1] + animationAdjust
    if (dragOffset) {
      const [xOff, yOff] = dragOffset
      x += xOff
      y += yOff
    }
    return [x, y]
  }

  syncWithAppState = react(
    () => [this.props.appPageStore.appState.size, this.props.appPageStore.appState.position],
    ([size, position]) => {
      ensure('size', !!size)
      ensure('not torn', !this.props.appPageStore.isTorn)
      this.sizeD = size
      this.posD = position
    },
  )

  handleResize: ResizeCallback = (_e, direction, _r, { width, height }) => {
    console.log('resizing', direction, width, height)
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
    if (this.props.appPageStore.isPeek) {
      AppActions.tearPeek()
    }
  }, 100)

  deferredSetAppState = react(
    () => [this.sizeD, this.posD],
    async ([size, position], { sleep }) => {
      await sleep(100)
      ensure('hasSize', size[0] !== 0 && size[1] !== 0)
      console.log('deferred set app state', size, position)
      AppActions.setAppState({ size, position })
    },
    {
      deferFirstRun: true,
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
  attach('appPageStore'),
  attach({
    store: AppFrameStore,
  }),
  view,
)
export const AppFrame = decorator(({ appPageStore, store, children, theme }: AppFrameProps) => {
  const { isShown, willShow, willHide, state, willStayShown } = appPageStore
  if (!state || !state.position || !state.position.length || !state.target) {
    return null
  }
  const borderShadow = ['inset', 0, 0, 0, 0.5, theme.frameBorderColor]
  const isHidden = !state
  const onRight = !state.peekOnLeft
  const padding = [SHADOW_PAD, onRight ? SHADOW_PAD : 0, SHADOW_PAD, !onRight ? SHADOW_PAD : 0]
  const margin = padding.map(x => -x)
  const boxShadow = [[onRight ? 8 : -8, 8, SHADOW_PAD, [0, 0, 0, 0.35]]]
  const transition = transitions(appPageStore)
  const size = store.sizeD
  console.log('render app frame', store.framePosition, { width: size[0], height: size[1] })
  return (
    <Resizable
      defaultSize={{ width: size[0], height: size[1] }}
      minWidth={100}
      minHeight={100}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      onResizeStop={store.handleResize}
      className="resizable"
      style={{
        zIndex: 2,
        // keep size/positionX linked to be fast...
        width: size[0],
        height: size[1],
        // dont put this in transform so it doesnt animate
        // it needs to move quickly because the frame itself resizes
        // and so it has to update the width + left at same time
        left: store.framePosition[0],
        // ...but have the positionY animate nicely
        transform: `translateX(0px) translateY(${store.framePosition[1]}px)`,
        transition,
        opacity: isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
      }}
    >
      <PeekFrameContainer
        width={size[0]}
        height={size[1]}
        pointerEvents={isShown ? 'auto' : 'none'}
      >
        <AppFrameArrow appPageStore={appPageStore} borderShadow={borderShadow} />
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

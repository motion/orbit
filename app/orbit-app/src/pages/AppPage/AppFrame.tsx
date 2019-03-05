import { gloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import { ensure, on, react, useHook, useStore } from '@mcro/use-store'
import { debounce } from 'lodash'
import { observer } from 'mobx-react-lite'
import Resizable, { ResizeCallback } from 're-resizable'
import * as React from 'react'
import { AppActions } from '../../actions/appActions/AppActions'
import * as Constants from '../../constants'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import AppFrameArrow from './AppFrameArrow'
import { AppPageStore } from './AppPageStore'

const SHADOW_PAD = 70

const transitions = (store: AppPageStore) => {
  if (store.isTorn) return 'transform linear 10ms'
  if (store.willHide) return 'transform ease 100ms'
  if (store.willStayShown) return 'transform ease 60ms'
  return 'transform ease 100ms'
}

const AppFrameBorder = gloss(UI.View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  borderRadius: Constants.PEEK_BORDER_RADIUS,
  pointerEvents: 'none',
})

const AppMainContent = gloss(UI.View, {
  flex: 1,
  overflow: 'hidden',
  opacity: 1,
})

const arrToObj = size => {
  return {
    width: size[0],
    height: size[1],
  }
}

const initialAppState = App.getAppState(Constants.PEEK_ID)

export class AppFrameStore {
  stores = useHook(useStoresSimple)

  // frame position and size
  ogSize = arrToObj(initialAppState.size)
  ogPosition = initialAppState.position
  resizeSize = { width: 0, height: 0 }
  resizePosition = [0, 0]
  offMove = null
  offUp = null
  initMouseDown = null
  frameMove?: [number, number] = null
  sidebarWidth = 200
  showSidebar = false

  willUnmount() {
    this.clearDragHandlers()
  }

  get size() {
    return {
      width: this.ogSize.width + this.resizeSize.width,
      height: this.ogSize.height + this.resizeSize.height,
    }
  }

  get position() {
    return [
      this.ogPosition[0] + this.resizePosition[0],
      this.ogPosition[1] + this.resizePosition[1],
    ]
  }

  get framePosition() {
    const { willShow, willStayShown, willHide } = this.stores.appPageStore
    // determine x adjustments
    const animationAdjust = (willShow && !willStayShown) || willHide ? -6 : 0
    let x = this.position[0]
    let y = this.position[1] + animationAdjust
    if (this.frameMove) {
      const [xOff, yOff] = this.frameMove
      x += xOff
      y += yOff
    }
    return [x, y]
  }

  showSidebarOnTear = react(
    () => this.stores.appPageStore.isTorn,
    torn => {
      ensure('torn', torn)
      this.showSidebar = true
    },
  )

  syncFromAppState = react(
    () => [this.stores.appPageStore.appState.size, this.stores.appPageStore.appState.position],
    ([size, position]) => {
      ensure('size', !!size)
      ensure('not torn', !this.stores.appPageStore.isTorn)
      this.ogSize = arrToObj(size)
      this.ogPosition = position
    },
  )

  syncToAppState = react(
    () => [this.ogSize, this.ogPosition],
    async ([size, position], { sleep }) => {
      await sleep(100)
      ensure('hasSize', size.width !== 0 && size.height !== 0)
      console.log('deferred set app state', size, position)
      AppActions.setAppState({ size: [size.width, size.height], position })
    },
    {
      deferFirstRun: true,
    },
  )

  handleResize: ResizeCallback = (_e, direction, _r, sizeDiff) => {
    console.log('resizing', direction, sizeDiff)
    switch (direction) {
      case 'right':
      case 'bottom':
      case 'bottomRight':
        this.resizeSize = sizeDiff
        break
      case 'top':
      case 'left':
      case 'topLeft':
        this.resizePosition = [sizeDiff.width, sizeDiff.height]
        this.resizeSize = sizeDiff
        break
    }

    this.tearOnFinishResize()
  }

  handleResizeStop = () => {
    this.ogSize = {
      width: this.ogSize.width + this.resizeSize.width,
      height: this.ogSize.height + this.resizeSize.height,
    }
    this.resizeSize = { height: 0, width: 0 }
  }

  tearOnFinishResize = debounce(() => {
    if (this.stores.appPageStore.isPeek) {
      AppActions.tearPeek()
    }
  }, 100)

  onDragStart = e => {
    console.log('drag titlebar...')
    e.preventDefault()
    this.stores.appPageStore.tearPeek()
    this.clearDragHandlers()
    this.initMouseDown = {
      x: e.clientX,
      y: e.clientY,
    }
    this.offMove = on(this, window, 'mousemove', this.handleDragMove)
    this.offUp = on(this, window, 'mouseup', this.handleDragEnd)
  }

  clearDragHandlers = () => {
    if (this.offMove) {
      this.offMove()
      this.offMove = null
    }
    if (this.offUp) {
      this.offUp()
      this.offUp = null
    }
  }

  handleDragMove = e => {
    const { x, y } = this.initMouseDown
    this.frameMove = [e.clientX - x, e.clientY - y]
  }

  // this is triggered after Actions.finishPeekDrag
  // where we can reset the frameMove in the same frame
  finishDrag = false

  handleDragEnd = () => {
    this.clearDragHandlers()

    // now that it's pinned, update position
    // reset drag offset while simultaneously setting official position
    // this *shouldnt* jitter, technically
    this.finishDrag = true
    AppActions.finishPeekDrag([...this.framePosition])
  }

  resetframeMoveOnFinishDrag = react(
    () => App.getAppState(Constants.PEEK_ID).position,
    () => {
      ensure('finished drag', this.finishDrag)
      console.log('finish drag?', this.frameMove, App.peeksState[Constants.PEEK_ID].position)
      this.frameMove = [0, 0]
      this.finishDrag = false
    },
  )

  setSidebarWidth = (width, _height, desiredWidth) => {
    // the desiredWidth lets you collapse/uncollapse using dragging
    if (desiredWidth < 100) {
      this.showSidebar = false
    } else {
      if (desiredWidth > 130 && !this.showSidebar) {
        this.showSidebar = true
      }
      this.sidebarWidth = width
    }
  }

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar
  }
}

const PeekFrameContainer = gloss(UI.View, {
  // alignItems: 'flex-end',
  position: 'absolute',
  right: 0,
  zIndex: 2,
})

export default observer(function AppFrame({ children }: { children: any }) {
  const { activeTheme } = React.useContext(UI.ThemeContext)
  const { appPageStore } = useStores()
  const appFrameStore = useStore(AppFrameStore)
  const { isShown, willShow, willHide, state, willStayShown } = appPageStore
  const borderShadow = ['inset', 0, 0, 0, 0.5, activeTheme.frameBorderColor]
  const isHidden = !state
  const onRight = state && !state.peekOnLeft
  const padding = [SHADOW_PAD, onRight ? SHADOW_PAD : 0, SHADOW_PAD, !onRight ? SHADOW_PAD : 0]
  const margin = padding.map(x => -x)
  const boxShadow = [[onRight ? 8 : -8, 8, SHADOW_PAD, [0, 0, 0, 0.25]]]
  const transition = transitions(appPageStore)
  return (
    <Resizable
      size={appFrameStore.size}
      minWidth={100}
      minHeight={100}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      onResize={appFrameStore.handleResize}
      onResizeStop={appFrameStore.handleResizeStop}
      className="resizable"
      style={{
        zIndex: 2,
        // keep size/positionX linked to be fast...
        // dont put this in transform so it doesnt animate
        // it needs to move quickly because the frame itself resizes
        // and so it has to update the width + left at same time
        left: appFrameStore.framePosition[0],
        // ...but have the positionY animate nicely
        transform: `translateX(0px) translateY(${appFrameStore.framePosition[1]}px)`,
        transition,
        opacity: isHidden || (willShow && !willStayShown) || willHide ? 0 : 1,
      }}
    >
      <PeekFrameContainer
        width={appFrameStore.size.width}
        height={appFrameStore.size.height}
        pointerEvents={isShown ? 'auto' : 'none'}
      >
        <AppFrameArrow borderShadow={borderShadow} />
        <UI.Col flex={1} padding={padding} margin={margin}>
          <UI.Col position="relative" flex={1}>
            <AppFrameBorder boxShadow={[borderShadow]} />
            <AppMainContent
              background={activeTheme.background}
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

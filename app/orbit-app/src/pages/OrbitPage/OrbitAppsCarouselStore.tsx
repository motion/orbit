import { always, createUsableStore, ensure, react, shallow } from '@o/kit'
import { AppBit } from '@o/models'
import { idFn } from '@o/ui'
import { numberBounder, numberScaler, sleep } from '@o/utils'
import { debounce } from 'lodash'
import { createRef } from 'react'

import { om } from '../../om/om'

class OrbitAppsCarouselStore {
  props: {
    apps: AppBit[]
    setCarouselSprings: Function
    setScrollSpring: Function
    rowWidth: number
  } = {
    apps: [],
    setCarouselSprings: idFn,
    setScrollSpring: idFn,
    rowWidth: 0,
  }

  // this is only the state that matters for animating
  state = shallow({
    index: 0,
    zoomedOut: true,
    isDragging: false,
  })

  get zoomedIn() {
    return !this.state.zoomedOut
  }
  get isOnOpenableApp() {
    return (
      this.focusedApp &&
      (this.focusedApp.tabDisplay === 'plain' || this.focusedApp.tabDisplay === 'pinned')
    )
  }

  hidden = false
  zoomIntoNextApp = false
  nextFocusedIndex = -1
  focusedIndex = 0
  isScrolling = false
  isZooming = false
  rowNode: HTMLElement | null = null
  rowRef = createRef<HTMLElement>()

  setRowNode = (next: HTMLElement) => {
    if (!next) return
    if (next === this.rowNode) return
    this.rowNode = next
    // @ts-ignore
    this.rowRef.current = next
  }
  setHidden(val = true) {
    this.hidden = val
  }

  get isAnimating() {
    return this.isScrolling || this.isZooming
  }
  get apps() {
    return this.props.apps
  }
  get focusedApp() {
    return this.apps[this.focusedIndex]
  }
  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.name} ${x.identifier}`,
      id: x.id,
    }))
  }

  updateAnimation = react(
    () => always(this.state),
    () => {
      if (this.props.setCarouselSprings) {
        this.props.setCarouselSprings(this.getSpring)
      }
    },
    {
      log: false,
    },
  )

  zoomIntoCurrentApp() {
    this.scrollToIndex(Math.round(this.state.index), true)
  }

  get currentNode(): HTMLElement | null {
    if (this.rowNode && this.focusedIndex > -1) {
      const elements = Array.from(this.rowNode.children) as HTMLElement[]
      return elements[this.focusedIndex] || null
    }
    return null
  }

  ensureScrollLeftOnResize = react(
    () => this.zoomedIn,
    (zoomedIn, { useEffect }) => {
      ensure('zoomedIn', zoomedIn)
      useEffect(() => {
        const onResize = () => {
          if (this.currentNode) {
            const x = this.currentNode.offsetLeft
            this.props.setScrollSpring({ x, config: { duration: 0 } })
          }
        }
        window.addEventListener('resize', onResize, { passive: true })
        return () => {
          window.removeEventListener('resize', onResize)
        }
      })
    },
  )

  // listen for pane movement
  // doing it with nextPane allows us to load in apps later
  scrollToIndex = (index: number, shouldZoomIn?: boolean) => {
    this.zoomIntoNextApp = !!shouldZoomIn
    if (index !== this.nextFocusedIndex) {
      this.nextFocusedIndex = index
    }
  }

  updateScrollPane = react(
    () => [this.nextFocusedIndex, this.zoomIntoNextApp],
    async ([index], { when }) => {
      await when(() => !!this.apps.length && !!this.props.setCarouselSprings)
      ensure('valid index', !!this.apps[index])
      this.animateAndScrollTo(index)
      if (this.zoomIntoNextApp) {
        this.setZoomedOut(false)
      }
      this.zoomIntoNextApp = false
      this.nextFocusedIndex = -1
    },
  )

  shouldZoomIn() {
    this.zoomIntoNextApp = true
  }

  ensureScrollToPane = react(
    () => this.isAnimating,
    () => {
      ensure('not animating', !this.isAnimating)
      ensure('zoomed out', !this.zoomedIn)
      this.finishScroll()
    },
  )

  undoShouldZoomOnZoomChange = react(
    () => this.state.zoomedOut,
    () => {
      this.zoomIntoNextApp = false
    },
  )

  setFocused(next: number, forceScroll = false) {
    if (!this.apps[next]) return
    if (next !== this.focusedIndex) {
      this.focusedIndex = next
      // update url
      const id = `${this.apps[next].id}`
      om.actions.router.showAppPage({
        id,
        replace: true,
      })
    }
    if (forceScroll) {
      this.animateAndScrollTo(this.focusedIndex)
    }
  }
  setZoomedOut(next: boolean = true) {
    this.state.zoomedOut = next
    this.zoomIntoNextApp = false
  }

  right() {
    if (this.focusedIndex < this.apps.length - 1) {
      this.setFocused(this.focusedIndex + 1, true)
    }
  }
  left() {
    if (this.focusedIndex > 0) {
      this.setFocused(this.focusedIndex - 1, true)
    }
  }

  animateCardsTo = (index: number) => {
    if (this.state.index !== index) {
      const paneIndex = Math.round(index)
      if (paneIndex !== this.focusedIndex) {
        this.setFocused(paneIndex)
      }
      this.state.index = index
    }
  }

  animateAndScrollTo = async (index: number) => {
    if (!this.rowNode) return
    if (this.state.index === index) return
    if (Math.round(index) !== this.focusedIndex) {
      this.setFocused(index)
    }
    const x = this.props.rowWidth * index
    if (this.rowNode.scrollLeft !== this.state.index * this.props.rowWidth) {
      this.updateScrollPositionToIndex()
      // TODO this sleep is necessary and a bug in react-spring
      await sleep(20)
    }
    this.props.setScrollSpring({ x })
    this.animateCardsTo(index)
  }

  isControlled = false
  animateTo = (index: number) => {
    this.isControlled = true
    this.animateCardsTo(index)
  }

  // after scroll, select focused card
  finishScroll = () => {
    const next = Math.round(this.state.index)
    this.setFocused(next, true)
  }
  finishWheel = debounce(() => {
    this.finishScroll()
  }, 100)
  updateScrollPositionToIndex = (index: number = this.state.index) => {
    this.props.setScrollSpring({
      x: index * this.props.rowWidth,
      config: { duration: 0 },
    })
  }

  // NOTE if this goes higher than 0.6, it seems to cause extra scrolling
  outScaler = numberScaler(0, 1, 0.55, 0.6)
  inScaler = numberScaler(0, 1, 0.9, 1)
  opacityScaler = numberScaler(1, 0, 1.2, 0)
  boundRotation = numberBounder(-10, 10)
  boundOpacity = numberBounder(0, 1)
  getSpring = (i: number) => {
    const { zoomedIn } = this
    const offset = this.state.index - i
    const importance = Math.min(1, Math.max(0, 1 - Math.abs(offset)))
    const scaler = zoomedIn ? this.inScaler : this.outScaler
    // zoom all further out of non-focused apps when zoomed in (so you cant see them behind transparent focused apps)
    const scale = zoomedIn && importance !== 1 ? 0.65 : scaler(importance)
    const rotation = (zoomedIn ? offset : offset - 0.5) * 10
    const ry = this.boundRotation(rotation)
    const opacity = this.boundOpacity(this.opacityScaler(1 - offset))
    // x is by percent!
    let x = 0
    if (zoomedIn) {
      // if zoomed in, move the side apps out of view (by 500px)
      if (offset !== 0) {
        // in percent
        x = offset > 0 ? -80 : 80
      }
    } else {
      // zoomed out, move them a bit faster, shift them to the right side
      // in percent
      x = (offset > -0.2 ? offset * 1 : offset * 0.25) + 19
    }
    const next = {
      x,
      y: 0,
      scale: scale * (this.state.isDragging ? 0.95 : 1),
      ry,
      opacity,
      ...(zoomedIn
        ? {
            // when zoomed in, go pretty fast to avoid long load
            config: { mass: 1, tension: 500, friction: 36, velocity: 5 },
          }
        : {
            config: { mass: 1, tension: 400, friction: 32, velocity: 3 },
          }),
    }
    return next
  }

  lastDragAt = Date.now()
  onDrag = next => {
    if (!this.state.zoomedOut) return
    const dx = -next.velocity * next.direction[0] * 30
    // avoid easy presses
    if (Math.abs(dx) < 0.5) return
    this.lastDragAt = Date.now()
    this.state.isDragging = next.dragging
    if (this.state.isDragging) {
      const dI = dx / this.props.rowWidth
      const nextI = Math.min(Math.max(0, this.state.index + dI), this.apps.length - 1)
      this.animateAndScrollTo(nextI)
    }
  }

  onFinishScroll = () => {
    this.isScrolling = false
  }
  onStartScroll = () => {
    this.isScrolling = true
  }
  onFinishZoom = () => {
    this.isZooming = false
  }
  onStartZoom = () => {
    this.isZooming = true
  }
}

export const stackMarginLessPct = 0.4
export const appsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
export const useAppsCarousel = appsCarouselStore.useStore
window['appsCarousel'] = appsCarouselStore

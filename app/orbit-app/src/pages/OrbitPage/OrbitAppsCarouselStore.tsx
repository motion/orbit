import { createUsableStore, ensure, react, shallow } from '@o/kit'
import { AppBit } from '@o/models'
import { MotionValue } from 'framer-motion'
import { debounce } from 'lodash'
import { spring, SpringProps } from 'popmotion'
import { createRef } from 'react'

import { om } from '../../om/om'

const createUpdateableSpring = (
  defaultVal: number,
  config?: SpringProps,
): {
  value: MotionValue
  update: (config: SpringProps | false) => void
  reset: () => void
} => {
  let value = new MotionValue(defaultVal)
  const defaultConfig = config
  function update(config?: SpringProps | false) {
    if (config === false) {
      value.stop()
    } else {
      value.attach((v, set) => {
        value.stop()
        spring({
          from: value.get(),
          to: v,
          velocity: value.getVelocity(),
          ...(config || defaultConfig),
        }).start(set)
        return value.get()
      })
    }
  }
  update()
  return {
    value,
    update,
    reset() {
      update(defaultConfig)
    },
  }
}

class OrbitAppsCarouselStore {
  props: {
    apps: AppBit[]
    rowWidth: number
  } = {
    apps: [],
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
  controlled = false

  // motion/springs
  scrollSpring = createUpdateableSpring(0, { damping: 50, stiffness: 250 })
  scaleSpring = createUpdateableSpring(0.6, { damping: 50, stiffness: 250 })

  start() {
    this.scrollSpring.value.onChange(val => {
      if (this.controlled) {
        this.rowRef.current!.scrollLeft = val * window.innerWidth
      }
    })
  }

  setUncontrolled() {
    this.controlled = false
    this.scrollSpring.value.stop()
    // @ts-ignore
    this.rowRef.current!.style.scrollSnapType = 'x mandatory'
  }

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

  get focusedApp(): AppBit {
    return (
      this.apps[this.focusedIndex] || {
        identifier: '',
        id: -1,
        name: '--empty--',
      }
    )
  }

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.name} ${x.identifier}`,
      id: x.id,
    }))
  }

  updateZoom = react(
    () => [this.state.zoomedOut, this.state.isDragging],
    ([zoomedOut, isDragging]) => {
      this.scaleSpring.value.set(zoomedOut ? (isDragging ? 0.5 : 0.6) : 1)
    },
  )

  updateScroll = react(() => this.state.index, this.setScrollSpring)

  setScrollSpring(index: number) {
    if (this.rowRef.current) {
      this.rowRef.current.style['scrollSnapType'] = 'initial'
      this.controlled = true
      this.scrollSpring.value.set(index)
    }
  }

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

  updateScrollPositionToIndex = (index: number = this.state.index) => {
    if (this.rowNode) {
      this.rowNode.scrollLeft === index * this.props.rowWidth
    }
  }

  onResize = () => {
    if (this.currentNode && this.rowNode) {
      // dont animate
      this.rowNode.scrollLeft = this.currentNode.offsetLeft
    }
  }

  ensureScrollLeftOnResize = react(
    () => this.zoomedIn,
    (zoomedIn, { useEffect }) => {
      ensure('zoomedIn', zoomedIn)
      useEffect(() => {
        window.addEventListener('resize', this.onResize, { passive: true })
        return () => {
          window.removeEventListener('resize', this.onResize)
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
      await when(() => !!this.apps.length)
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
    }
    this.setScrollSpring(x)
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

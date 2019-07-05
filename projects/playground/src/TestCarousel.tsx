import { always, createUsableStore, ensure, react, shallow, useReaction } from '@o/kit'
import { Card, CardProps, idFn, Row, Title, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import { numberBounder, numberScaler } from '@o/utils'
import React, { createRef, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { to, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'

class OrbitAppsCarouselStore {
  props: {
    apps: any[]
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

  zoomIntoNextApp = false
  nextFocusedIndex = -1
  focusedIndex = 0
  isScrolling = false
  isZooming = false

  rowNode: HTMLElement = null
  rowRef = createRef<HTMLElement>()

  setRowNode = (next: HTMLElement) => {
    this.rowNode = next
    // @ts-ignore
    this.rowRef.current = next
  }

  get isAnimating() {
    return this.isScrolling || this.isZooming
  }

  get apps() {
    return this.props.apps
  }

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.name} ${x.identifier}`,
      id: x.id,
    }))
  }

  updateAnimation = react(
    () => always(this.state),
    () => this.props.setCarouselSprings(this.getSpring),
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
          const x = this.currentNode.offsetLeft
          this.props.setScrollSpring({ x, config: { duration: 0 } })
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
    if (shouldZoomIn) {
      this.zoomIntoNextApp = true
    }
    this.nextFocusedIndex = index
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

  undoShouldZoomOnZoomChange = react(
    () => this.state.zoomedOut,
    () => {
      this.zoomIntoNextApp = false
    },
  )

  forceScrollToPane = react(
    () => this.focusedIndex,
    async (_, { sleep }) => {
      await sleep(1000)
      this.animateAndScrollTo(Math.round(this.state.index))
    },
  )

  setFocusedAppIndex(next: number, forceScroll = false) {
    if (!this.apps[next]) {
      console.warn('no app at index', next)
      return
    }
    if (next !== this.focusedIndex) {
      this.focusedIndex = next
      if (forceScroll) {
        this.animateAndScrollTo(this.focusedIndex)
      }
    }
  }

  setZoomedOut(next: boolean = true) {
    this.state.zoomedOut = next
    this.zoomIntoNextApp = false
  }

  right() {
    if (this.focusedIndex < this.apps.length - 1) {
      this.setFocusedAppIndex(this.focusedIndex + 1, true)
    }
  }

  left() {
    if (this.focusedIndex > 0) {
      this.setFocusedAppIndex(this.focusedIndex - 1, true)
    }
  }

  animateCardsTo = (index: number) => {
    if (this.state.index !== index) {
      const paneIndex = Math.round(index)
      if (paneIndex !== this.focusedIndex) {
        this.setFocusedAppIndex(paneIndex)
      }
      this.state.index = index
    }
  }

  animateAndScrollTo = (index: number) => {
    if (Math.round(index) !== this.focusedIndex) {
      this.setFocusedAppIndex(index)
    }
    const x = this.props.rowWidth * index
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
    this.setFocusedAppIndex(Math.round(this.state.index))
    this.updateScrollPositionToIndex(this.state.index)
  }

  updateScrollPositionToIndex = (index: number) => {
    this.props.setScrollSpring({ x: index * this.props.rowWidth, config: { duration: 0 } })
  }

  outScaler = numberScaler(0, 1, 0.8, 0.9)
  inScaler = numberScaler(0, 1, 0.9, 1)
  boundRotation = numberBounder(-10, 10)

  getSpring = (i: number) => {
    
  }

  onDrag = next => {
    if (!this.state.zoomedOut) return

    this.state.isDragging = next.dragging

    const dx = -next.velocity * next.direction[0] * 30
    // console.log('next', next)

    // avoid easy presses
    if (Math.abs(dx) < 0.5) return

    if (this.state.isDragging) {
      const dI = dx / this.props.rowWidth
      const nextI = Math.min(Math.max(0, this.state.index + dI), this.apps.length - 1)
      this.animateAndScrollTo(nextI)
    } else {
      const paneIndex = Math.round(this.state.index)
      this.animateAndScrollTo(paneIndex)
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

export const appsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
export const useAppsCarousel = appsCarouselStore.useStore
window['appsCarousel'] = appsCarouselStore

export const TestCarousel = memo(() => {
  const rowRef = appsCarouselStore.rowRef
  const apps = [
    { id: 0, title: 'ok' },
    { id: 1, title: 'ok2' },
    { id: 2, title: 'ok3' },
    { id: 3, title: 'o4' },
  ]
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowSize = useParentNodeSize({ ref: rowRef })

  const [scrollLeft, setScrollLeft] = useState(0)

  // const [scrollSpring, setScrollSpring] = useSpring(() => ({
  //   x: 0,
  //   onRest: appsCarouselStore.onFinishScroll,
  //   onStart: appsCarouselStore.onStartScroll,
  // }))

  // const [springs, setCarouselSprings] = useSprings(apps.length, i => ({
  //   ...appsCarouselStore.getSpring(i),
  //   config: { mass: 1, tension: 300, friction: 30 },
  //   onRest: appsCarouselStore.onFinishZoom,
  //   onStart: appsCarouselStore.onStartZoom,
  // }))

  useEffect(() => {
    if (rowSize.width) {
      appsCarouselStore.setProps({
        apps,
        setScrollLeft,
        rowWidth: rowSize.width,
      })
    }
  }, [apps, rowSize])

  const bind = useGesture({
    onDrag: appsCarouselStore.onDrag,
  })

  // const [scrollable, isDisabled] = useReaction(
  //   () => [
  //     appsCarouselStore.isScrolling || appsCarouselStore.state.zoomedOut ? ('x' as const) : false,
  //     appsCarouselStore.state.zoomedOut === true,
  //   ],
  //   async (next, { when, sleep }) => {
  //     await when(() => !appsCarouselStore.isAnimating)
  //     await sleep(100)
  //     return next
  //   },
  //   {
  //     defaultValue: [false, true],
  //     delay: 50,
  //   },
  // )

  return (
    <View width="100%" height="100%" overflow="hidden" ref={frameRef}>
      <Row
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        scrollable
        onWheel={() => {
          appsCarouselStore.finishScroll()
        }}
        // !!!!!!!!!!!!!!!!!!!!!!!! lets make perspective set automatically by default to this when animation set
        // perspective="600px"
        {...animated({
          scrollLeft,
          isZoomed: appsCarouselStore.isZooming
        })}
        // which just sets...
        // scrollLeft={scrollLeft}
        // animated={{
        //   scrollLeft: true,
        // }}
        ref={appsCarouselStore.setRowNode}
        {...bind()}
      >
        {apps.map((app, index) => (
          <OrbitAppCard
            key={app.id}
            index={index}
            app={app}
            width={frameSize.width}
            height={frameSize.height}
          />
        ))}
      </Row>
    </View>
  )
})

type OrbitAppCardProps = any

const OrbitAppCard = memo(
  ({ app, index, isDisabled, springs, ...cardProps }: OrbitAppCardProps) => {
    const theme = useTheme()
    const isFocused = useReaction(() => index === appsCarouselStore.focusedIndex, { delay: 40 }, [
      index,
    ])
    const isFocusZoomed = useReaction(
      () => index === appsCarouselStore.focusedIndex && !appsCarouselStore.state.zoomedOut,
      {
        delay: 40,
      },
      [index],
    )
    const cardRef = useRef(null)

    return (
      <Card
        ref={cardRef}
        background={isFocusZoomed ? theme.sidebarBackgroundTransparent : theme.backgroundStronger}
        onClick={() => {
          appsCarouselStore.setFocusedAppIndex(index, true)
        }}
        onDoubleClick={() => {
          appsCarouselStore.scrollToIndex(index, true)
        }}
        {...(isFocused
          ? {
              boxShadow: [
                [0, 0, 0, 3, theme.alternates.selected['background']],
                [0, 0, 30, [0, 0, 0, 0.5]],
              ],
            }
          : {
              boxShadow: [[0, 0, 10, [0, 0, 0, 0.5]]],
            })}
        transition="box-shadow 200ms ease, background 300ms ease"
        zIndex={isFocused ? 2 : 1}
        {...animated(context => {
          const importance = context.getStageIntersection()
          return {
            transform: {
              rotateY: (index - importance) * 10,
              scale: context.isZoomed ? 1 : importance
            }
          }
        })}
        // animated={{
        //   transform: true,
        // }}
        // transform={to(
        //   Object.keys(spring).map(k => spring[k]),
        //   (x, y, scale, ry) => `translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
        // )}
        {...cardProps}
      >
        <Title>{app.title}</Title>
      </Card>
    )
  },
)

const importance = Math.min(1, Math.max(0, 1 - Math.abs(this.state.index - i)))
    const scaler = this.zoomedIn ? this.inScaler : this.outScaler
    // zoom all further out of non-focused apps when zoomed in (so you cant see them behind transparent focused apps)
    const scale = this.zoomedIn && importance !== 1 ? 0.25 : scaler(importance)
    const ry = this.boundRotation((this.state.index - i) * 10)
    return {
      x: 0,
      y: 0,
      scale: scale * (this.state.isDragging ? 0.95 : 1),
      ry,
    }

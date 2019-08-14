import { always, AppDefinition, AppIcon, createUsableStore, ensure, react, shallow, Templates, useAppDefinition, useReaction, useStore } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, FullScreen, idFn, Row, SimpleText, useIntersectionObserver, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import { numberBounder, numberScaler, sleep } from '@o/utils'
import { debounce } from 'lodash'
import React, { createRef, memo, useEffect, useLayoutEffect, useRef } from 'react'
import { to, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { om, useOm } from '../../om/om'
import { OrbitApp, whenIdle } from './OrbitApp'
import { OrbitSearchResults } from './OrbitSearchResults'

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

  outScaler = numberScaler(0, 1, 0.6, 0.65)
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
        x = offset > 0 ? -30 : 30
      }
    } else {
      // zoomed out, move them a bit faster, shift them to the right side
      // remember: this is in percent
      x = (offset > -0.2 ? offset * 1 : offset * 0.25) + 19
    }
    const next = {
      x,
      y: 0,
      scale: scale * (this.state.isDragging ? 0.95 : 1),
      ry,
      opacity,
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

const stackMarginLessPct = 0.3

export const appsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
export const useAppsCarousel = appsCarouselStore.useStore
window['appsCarousel'] = appsCarouselStore

let lastHiddenVal = false

export const OrbitAppsCarousel = memo(() => {
  const { state } = useOm()
  const rowRef = appsCarouselStore.rowRef
  const apps = state.apps.activeClientApps
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowSize = useParentNodeSize({ ref: rowRef })

  const [scrollSpring, setScrollSpring, stopScrollSpring] = useSpring(() => ({
    x: 0,
    onRest: appsCarouselStore.onFinishScroll,
    onStart: appsCarouselStore.onStartScroll,
  }))

  const [springs, setCarouselSprings] = useSprings(apps.length, i => ({
    ...appsCarouselStore.getSpring(i),
    config: { mass: 1, tension: 300, friction: 30 },
    onRest: appsCarouselStore.onFinishZoom,
    onStart: appsCarouselStore.onStartZoom,
  }))

  const rowWidth = rowSize.width ? rowSize.width * (1 - stackMarginLessPct) : 0

  useEffect(() => {
    if (rowWidth) {
      appsCarouselStore.setProps({
        apps,
        setCarouselSprings,
        setScrollSpring,
        rowWidth,
      })
    }
  }, [apps, setScrollSpring, setCarouselSprings, rowWidth])

  const bind = useGesture({
    onDrag: appsCarouselStore.onDrag,
  })

  /**
   * Use this to update state after animations finish
   */
  const hidden = useReaction(() => appsCarouselStore.hidden)
  const [scrollable, disableInteraction] = useReaction(
    () =>
      [
        appsCarouselStore.isScrolling || appsCarouselStore.zoomedIn ? false : 'x',
        appsCarouselStore.zoomedIn === false,
      ] as const,
    async (next, { when, sleep }) => {
      await when(() => !appsCarouselStore.isAnimating)
      await sleep(100)
      return next
    },
    {
      defaultValue: [false, true],
      name: 'OrbitAppsCarousel.render',
    },
  )

  useLayoutEffect(() => {
    rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  }, [scrollable])

  // comented out: was causing really crazy bugs
  // this is literally just to fix a stupid hmr bug where when on setupApp
  // you'd find it scrolled weirdly, i tried mutationObserver/addEventListener('scroll'),
  // neither pick it up because the event is removed
  // useEffect(() => {
  //   if (rowRef.current) {
  //     const curLeft = Math.round(rowRef.current.scrollLeft)
  //     const index = appsCarouselStore.focusedIndex
  //     const expectedLeft = Math.floor(index * rowWidth)
  //     if (curLeft !== expectedLeft) {
  //       appsCarouselStore.animateAndScrollTo(0)
  //       sleep(100).then(() => {
  //         appsCarouselStore.animateAndScrollTo(index)
  //       })
  //       console.warn('mismatched scroll spring / scrollLeft', curLeft, expectedLeft)
  //     }
  //   }
  // })

  return (
    <View data-is="OrbitAppsCarousel" width="100%" height="100%">
      <FullScreen>
        <OrbitSearchResults />
      </FullScreen>
      <View
        width="100%"
        height="100%"
        overflow="hidden"
        ref={frameRef}
        transition="all ease 200ms"
        {...hidden && {
          pointerEvents: 'none',
          opacity: 0,
          transform: {
            rotateY: '20deg',
            scale: 0.9,
            x: 200,
          },
        }}
      >
        <Row
          data-is="OrbitAppsCarousel-Row"
          flex={1}
          alignItems="center"
          justifyContent="flex-start"
          scrollable={scrollable}
          overflow={scrollable ? undefined : 'hidden'}
          onWheel={() => {
            appsCarouselStore.onFinishScroll()
            stopScrollSpring()
            if (appsCarouselStore.state.zoomedOut) {
              appsCarouselStore.animateTo(rowRef.current!.scrollLeft / rowWidth)
            }
            appsCarouselStore.finishWheel()
          }}
          scrollLeft={scrollSpring.x}
          animated
          ref={appsCarouselStore.setRowNode}
          perspective="1000px"
          {...bind()}
        >
          {apps.map((app, index) => (
            <OrbitAppCard
              key={app.id}
              index={index}
              app={app}
              disableInteraction={disableInteraction}
              identifier={app.identifier!}
              width={frameSize.width}
              height={frameSize.height}
              springs={springs}
            />
          ))}
        </Row>
      </View>
    </View>
  )
})

/**
 * Handles visibility of the app as it moves in and out of viewport
 */

type OrbitAppCardProps = CardProps & {
  identifier: string
  disableInteraction: boolean
  springs: any
  index: number
  app: AppBit
}

class AppCardStore {
  isIntersected = false
  shouldRender = false

  renderApp = react(
    () => [this.isIntersected, appsCarouselStore.isAnimating],
    async ([isIntersected, isAnimating], { sleep }) => {
      ensure('not animating', !isAnimating)
      ensure('is intersected', isIntersected)
      await whenIdle()
      await sleep(50)
      await whenIdle()
      this.shouldRender = true
    },
  )

  setIsIntersected(val: boolean) {
    this.isIntersected = val
  }
}

const OrbitAppCard = memo(
  ({ app, identifier, index, disableInteraction, springs, ...cardProps }: OrbitAppCardProps) => {
    const definition = useAppDefinition(identifier)!
    const store = useStore(AppCardStore)
    const spring = springs[index]
    const theme = useTheme()
    const isFocused = useReaction(
      () => index === appsCarouselStore.focusedIndex,
      {
        // delay: 40,
        name: `AppCard${index}.isFocused`,
      },
      [index],
    )
    const isFocusZoomed = useReaction(
      () => index === appsCarouselStore.focusedIndex && !appsCarouselStore.state.zoomedOut,
      {
        delay: 40,
        name: `AppCard${index}.isFocusZoomed`,
      },
      [index],
    )
    const cardRef = useRef(null)

    useIntersectionObserver({
      ref: cardRef,
      options: {
        threshold: 0.9,
      },
      onChange(x) {
        const isIntersecting = !!(x.length && x[0].isIntersecting)
        store.setIsIntersected(isIntersecting)
      },
    })

    const mouseDown = useRef(-1)

    const cardBoxShadow = [15, 30, 120, [0, 0, 0, theme.background.isDark() ? 0.5 : 0.25]]

    // wrapping with view lets the scale transform not affect the scroll, for some reason this was happening
    // i thought scale transform doesnt affect layout?
    return (
      <View
        pointerEvents={isFocused ? 'inherit' : 'none'}
        data-is="OrbitAppCard-Container"
        zIndex={1000 - index}
        marginRight={`-${stackMarginLessPct * 100}%`}
      >
        <View
          animated
          transform={to(
            Object.keys(spring).map(k => spring[k]),
            (x, y, scale, ry) => `translate3d(${x}%,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
          )}
          opacity={spring.opacity}
          onMouseDown={() => {
            if (appsCarouselStore.zoomedIn) {
              return
            }
            mouseDown.current = Date.now()
          }}
          onMouseUp={e => {
            if (appsCarouselStore.zoomedIn) {
              return
            }
            if (mouseDown.current > appsCarouselStore.lastDragAt) {
              e.stopPropagation()
              appsCarouselStore.scrollToIndex(index, true)
            }
            mouseDown.current = -1
          }}
          position="relative"
        >
          {/* <AppIcon
            position="absolute"
            top={-10}
            left={-15}
            size={32}
            opacity={1}
            identifier={definition.id}
            colors={app.colors}
            opacity={appsCarouselStore.zoomedIn ? 0 : 1}
            pointerEvents="none"
          /> */}
          <Row
            alignItems="center"
            justifyContent="center"
            space="sm"
            padding
            position="absolute"
            bottom={-40}
            left={0}
            right={0}
          >
            <SimpleText>{app.name}</SimpleText>
          </Row>
          <Card
            data-is="OrbitAppCard"
            ref={cardRef}
            borderWidth={0}
            background={
              isFocusZoomed
                ? definition.viewConfig && definition.viewConfig.transparentBackground
                  ? theme.sidebarBackgroundTransparent
                  : theme.backgroundStronger
                : theme.backgroundStronger
            }
            borderRadius={isFocusZoomed ? 0 : 20}
            {...(isFocused
              ? {
                  boxShadow: [
                    [0, 0, 0, 3, theme.alternates!.selected['background']],
                    cardBoxShadow,
                  ],
                }
              : {
                  boxShadow: [cardBoxShadow],
                })}
            transition="background 300ms ease"
            {...cardProps}
          >
            <AppLoadingScreen definition={definition} app={app} visible={!store.shouldRender} />
            <OrbitApp
              id={app.id!}
              disableInteraction={disableInteraction}
              identifier={definition.id}
              appDef={definition}
              shouldRenderApp={store.shouldRender}
            />
          </Card>
        </View>
      </View>
    )
  },
)

type AppLoadingScreenProps = {
  visible: boolean
  app: AppBit
  definition: AppDefinition
}

const AppLoadingScreen = memo((props: AppLoadingScreenProps) => {
  return (
    <Templates.Message
      title={props.app.name}
      icon={<AppIcon identifier={props.definition.id} colors={props.app.colors} />}
      opacity={props.visible ? 1 : 0}
      transform={{
        y: props.visible ? 0 : 50,
      }}
      transition="all ease 200ms"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
    />
  )
})

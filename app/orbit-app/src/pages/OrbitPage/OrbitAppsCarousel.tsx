import { always, AppDefinition, AppIcon, createUsableStore, ensure, getAppDefinition, react, shallow, Templates, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, idFn, Row, SimpleText, useIntersectionObserver, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import { numberBounder, numberScaler, sleep } from '@o/utils'
import { debounce } from 'lodash'
import React, { createRef, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { to, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { om, useOm } from '../../om/om'
import { queryStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'
import { appsDrawerStore } from './OrbitAppsDrawer'
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

  zoomIntoNextApp = false
  nextFocusedIndex = -1
  focusedIndex = 0
  isScrolling = false
  isZooming = false

  rowNode: HTMLElement | null = null
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
          const x = this.currentNode!.offsetLeft
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

  scrollToSearchedApp = react(
    () => queryStore.queryInstant,
    async (query, { sleep }) => {
      await sleep(40)
      ensure('not on drawer', !appsDrawerStore.isOpen)
      ensure('has apps', !!this.apps.length)
      ensure('zoomed out', this.state.zoomedOut)
      ensure('not zooming into next app', !this.zoomIntoNextApp)
      if (query.indexOf(' ') > -1) {
        // searching within app
        const [_, firstWord] = query.split(' ')
        if (firstWord.trim().length) {
          this.state.zoomedOut = false
        }
      } else {
        // searching apps
        const searchedApp = fuzzyFilter(query, this.searchableApps)[0]
        const curId = searchedApp ? searchedApp.id : this.apps[0].id
        const appIndex = this.apps.findIndex(x => x.id === curId)
        this.setFocused(appIndex, true)
      }
    },
  )

  setFocused(next: number, forceScroll = false) {
    if (!this.apps[next]) {
      console.warn('no app at index', next)
      return
    }
    // debugger
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

  outScaler = numberScaler(0, 1, 0.5, 0.65)
  inScaler = numberScaler(0, 1, 0.9, 1)
  boundRotation = numberBounder(-10, 10)
  boundOpacity = numberBounder(0, 1)

  getSpring = (i: number) => {
    const { zoomedIn } = this
    const importance = Math.min(1, Math.max(0, 1 - Math.abs(this.state.index - i)))
    const scaler = zoomedIn ? this.inScaler : this.outScaler
    // zoom all further out of non-focused apps when zoomed in (so you cant see them behind transparent focused apps)
    const scale = zoomedIn && importance !== 1 ? 0.25 : scaler(importance)
    const offset = this.state.index - i
    const rotation = (zoomedIn ? offset : offset - 0.5) * 10
    const ry = this.boundRotation(rotation)
    const opacity = this.boundOpacity(1 - (this.state.index - i))
    const next = {
      x: zoomedIn ? 0 : 18,
      y: 0,
      scale: scale * (this.state.isDragging ? 0.95 : 1),
      ry,
      opacity,
    }
    console.log('ok', zoomedIn, next)
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

export const appsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
export const useAppsCarousel = appsCarouselStore.useStore
window['appsCarousel'] = appsCarouselStore

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

  useEffect(() => {
    if (rowSize.width) {
      appsCarouselStore.setProps({
        apps,
        setCarouselSprings,
        setScrollSpring,
        rowWidth: rowSize.width,
      })
    }
  }, [apps, setScrollSpring, setCarouselSprings, rowSize])

  const bind = useGesture({
    onDrag: appsCarouselStore.onDrag,
  })

  const [scrollable, disableInteraction] = useReaction(
    () => [
      appsCarouselStore.isScrolling || appsCarouselStore.state.zoomedOut ? ('x' as const) : false,
      appsCarouselStore.state.zoomedOut === true,
    ],
    async (next, { when, sleep }) => {
      await when(() => !appsCarouselStore.isAnimating)
      await sleep(300)
      return next
    },
    {
      defaultValue: [false, true],
      delay: 50,
    },
  )

  useLayoutEffect(() => {
    rowRef.current!.scrollLeft = scrollSpring.x.getValue()
  }, [scrollable])

  return (
    <View width="100%" height="100%" overflow="hidden" ref={frameRef}>
      <OrbitSearchResults />
      <Row
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        scrollable={scrollable}
        overflow={scrollable ? undefined : 'hidden'}
        onWheel={() => {
          stopScrollSpring()
          if (appsCarouselStore.state.zoomedOut) {
            appsCarouselStore.animateTo(rowRef.current!.scrollLeft / rowSize.width)
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
            definition={getAppDefinition(app.identifier!)}
            disableInteraction={disableInteraction}
            width={frameSize.width}
            height={frameSize.height}
            springs={springs}
          />
        ))}
      </Row>
    </View>
  )
})

/**
 * Handles visibility of the app as it moves in and out of viewport
 */

type OrbitAppCardProps = CardProps & {
  disableInteraction: boolean
  springs: any
  index: number
  app: AppBit
  definition: AppDefinition
}

const OrbitAppCard = memo(
  ({ app, definition, index, disableInteraction, springs, ...cardProps }: OrbitAppCardProps) => {
    const spring = springs[index]
    const [renderApp, setRenderApp] = useState(false)
    const theme = useTheme()
    const isFocused = useReaction(
      () => index === appsCarouselStore.focusedIndex,
      { delay: 40, name: `AppCard${index}.isFocused` },
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

    /**
     * These next hooks handle loading the app when not animating
     */
    const shouldRender = useRef(false)
    const lastIntersection = useRef(false)

    useReaction(
      () => appsCarouselStore.isAnimating,
      isAnimating => {
        if (isAnimating) {
          shouldRender.current = false
        } else {
          if (lastIntersection.current) {
            setRenderApp(true)
          }
        }
      },
      {
        name: `AppCard${index}.setRender`,
      },
    )

    useIntersectionObserver({
      ref: cardRef,
      options: {
        threshold: 1,
      },
      onChange(x) {
        const isIntersecting = !!(x.length && x[0].isIntersecting)
        lastIntersection.current = isIntersecting
        if (isIntersecting && !renderApp) {
          shouldRender.current = true
          whenIdle().then(() => {
            setTimeout(() => {
              if (shouldRender.current) {
                setRenderApp(true)
              }
            }, 50)
          })
        } else {
          shouldRender.current = false
        }
      },
    })

    const mouseDown = useRef(-1)

    // wrapping with view lets the scale transform not affect the scroll, for some reason this was happening
    // i thought scale transform doesnt affect layout?
    return (
      <View zIndex={isFocused ? 2 : 1}>
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
          {/* title of app card */}
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
              isFocusZoomed ? theme.sidebarBackgroundTransparent : theme.backgroundStronger
            }
            borderRadius={isFocusZoomed ? 0 : 20}
            {...(isFocused
              ? {
                  boxShadow: [
                    [0, 0, 0, 3, theme.alternates!.selected['background']],
                    [0, 0, 30, [0, 0, 0, 0.5]],
                  ],
                }
              : {
                  boxShadow: [[0, 0, 10, [0, 0, 0, 0.5]]],
                })}
            transition="box-shadow 200ms ease, background 300ms ease"
            {...cardProps}
          >
            <AppLoadingScreen definition={definition} app={app} visible={!renderApp} />
            <OrbitApp
              id={app.id!}
              disableInteraction={disableInteraction}
              identifier={definition.id}
              appDef={definition}
              shouldRenderApp={renderApp}
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
      subTitle={props.definition.id}
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

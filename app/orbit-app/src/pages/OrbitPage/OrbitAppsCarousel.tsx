import { always, AppDefinition, AppIcon, AppWithDefinition, createUsableStore, ensure, react, shallow, Templates, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, idFn, Row, useIntersectionObserver, useNodeSize, useParentNodeSize, useTheme, View } from '@o/ui'
import { numberBounder, numberScaler } from '@o/utils'
import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { to, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { om } from '../../om/om'
import { queryStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'
import { appsDrawerStore } from './OrbitAppsDrawer'

class OrbitAppsCarouselStore {
  props: {
    apps: AppWithDefinition[]
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

  zoomIntoNextApp = false
  nextPane = -1

  isScrolling = false
  isZooming = false

  get isAnimating() {
    return this.isScrolling || this.isZooming
  }

  get apps() {
    return this.props.apps
  }

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.app.name} ${x.definition.id}`,
      id: x.app.id,
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
    this.scrollToPane(Math.round(this.state.index), true)
  }

  // listen for pane movement
  // doing it with nextPane allows us to load in apps later
  scrollToPane = (index: number, shouldZoomIn?: boolean) => {
    if (shouldZoomIn) {
      this.zoomIntoNextApp = true
    }
    this.nextPane = index
  }

  updateScrollPane = react(
    () => [this.nextPane, this.zoomIntoNextApp],
    async ([index], { when, sleep }) => {
      ensure('valid index', !!this.apps[index])
      await when(() => !!this.apps.length)
      this.animateAndScrollTo(index)
      if (this.zoomIntoNextApp) {
        await sleep(100)
        this.setZoomedOut(false)
      }
    },
  )

  shouldZoomIn() {
    this.zoomIntoNextApp = true
  }

  scrollToSearchedApp = react(
    () => queryStore.queryInstant,
    async (query, { sleep }) => {
      await sleep(40)
      ensure('not on drawer', !appsDrawerStore.isOpen)
      ensure('has apps', !!this.apps.length)
      ensure('zoomed out', this.state.zoomedOut)
      if (query.indexOf(' ') > -1) {
        // searching within app
        const [_, firstWord] = query.split(' ')
        if (firstWord.trim().length) {
          this.state.zoomedOut = false
        }
      } else {
        // searching apps
        const searchedApp = fuzzyFilter(query, this.searchableApps)[0]
        const curId = searchedApp ? searchedApp.id : this.apps[0].app.id
        const appIndex = this.apps.findIndex(x => x.app.id === curId)
        this.setFocusedAppIndex(appIndex, true)
      }
    },
  )

  triggerScrollToFocused = 0

  focusedAppIndex = 0
  setFocusedAppIndex(next: number, forceScroll = false) {
    if (!this.apps[next]) {
      console.warn('no app at index', next)
      return
    }
    if (next !== this.focusedAppIndex) {
      this.focusedAppIndex = next

      // update url
      const id = `${this.apps[next].app.id}`
      om.actions.router.showAppPage({
        id,
        replace: true,
      })

      if (forceScroll) {
        this.animateAndScrollTo(this.focusedAppIndex)
      }
    }
  }

  setZoomedOut(next: boolean = true) {
    this.state.zoomedOut = next
    this.zoomIntoNextApp = false
  }

  right() {
    if (this.focusedAppIndex < this.apps.length - 1) {
      this.setFocusedAppIndex(this.focusedAppIndex + 1, true)
    }
  }

  left() {
    if (this.focusedAppIndex > 0) {
      this.setFocusedAppIndex(this.focusedAppIndex - 1, true)
    }
  }

  animateCardsTo = (index: number) => {
    if (this.state.index !== index) {
      const paneIndex = Math.round(index)
      if (paneIndex !== this.focusedAppIndex) {
        this.setFocusedAppIndex(paneIndex)
      }
      this.state.index = index
    }
  }

  animateAndScrollTo = (index: number) => {
    if (Math.round(index) !== this.focusedAppIndex) {
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
    const importance = Math.min(1, Math.max(0, 1 - Math.abs(this.state.index - i)))
    const scaler = this.state.zoomedOut ? this.outScaler : this.inScaler
    const scale = scaler(importance)
    const ry = this.boundRotation((this.state.index - i) * 10)
    return {
      x: 0,
      y: 0,
      scale: scale * (this.state.isDragging ? 0.95 : 1),
      ry,
    }
  }

  onDrag = next => {
    if (!this.state.zoomedOut) return

    this.state.isDragging = next.dragging

    const dx = -next.velocity * next.direction[0] * 15
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

export const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowRef = useRef<HTMLElement>(null)
  const rowSize = useParentNodeSize({ ref: rowRef })

  const [scrollSpring, setScrollSpring] = useSpring(() => ({
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

  const [scrollable, isDisabled] = useReaction(
    () => [
      appsCarouselStore.isScrolling || appsCarouselStore.state.zoomedOut ? ('x' as const) : false,
      appsCarouselStore.state.zoomedOut === true,
    ],
    async (next, { when, sleep }) => {
      await when(() => !appsCarouselStore.isAnimating)
      await sleep(100)
      return next
    },
    {
      defaultValue: [false, true],
      delay: 50,
    },
  )

  useLayoutEffect(() => {
    rowRef.current.scrollLeft = scrollSpring.x.getValue()
  }, [scrollable])

  return (
    <View width="100%" height="100%" overflow="hidden" ref={frameRef}>
      <Row
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        scrollable={scrollable}
        overflow={scrollable ? undefined : 'hidden'}
        onWheel={useCallback(() => {
          if (appsCarouselStore.state.zoomedOut) {
            appsCarouselStore.animateTo(rowRef.current.scrollLeft / rowSize.width)
          }
          appsCarouselStore.finishScroll()
        }, [rowRef.current, rowSize])}
        scrollLeft={scrollSpring.x}
        animated
        ref={rowRef}
        perspective="600px"
        {...bind()}
      >
        {apps.map(({ app, definition }, index) => (
          <OrbitAppCard
            key={app.id}
            index={index}
            app={app}
            definition={definition}
            isDisabled={isDisabled}
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
  isDisabled: boolean
  springs: any
  index: number
  app: AppBit
  definition: AppDefinition
}

const OrbitAppCard = memo(
  ({ app, definition, index, isDisabled, springs, ...cardProps }: OrbitAppCardProps) => {
    const spring = springs[index]
    const [renderApp, setRenderApp] = useState(false)
    const theme = useTheme()
    const isFocused = useReaction(
      () => index === appsCarouselStore.focusedAppIndex,
      { delay: 40 },
      [index],
    )
    const isFocusZoomed = useReaction(
      () => index === appsCarouselStore.focusedAppIndex && !appsCarouselStore.state.zoomedOut,
      {
        delay: 40,
      },
      [index],
    )
    const cardRef = useRef(null)

    /**
     * These next hooks handle loading the app when not animating
     */
    const shouldRender = useRef(false)
    const lastIntersection = useRef(null)

    useReaction(
      () => appsCarouselStore.isAnimating,
      isAnimating => {
        if (isAnimating) {
          shouldRender.current = false
        } else {
          if (lastIntersection.current) {
            console.warn('setting true')
            setRenderApp(true)
          }
        }
      },
    )

    useIntersectionObserver({
      ref: cardRef,
      options: {
        threshold: 1,
      },
      onChange(x) {
        const isIntersecting = x.length && x[0].isIntersecting
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

    return (
      <Card
        ref={cardRef}
        borderWidth={0}
        background={theme.backgroundStronger}
        overflow="hidden"
        borderRadius={isFocusZoomed ? 0 : 12}
        animated
        onClick={() => {
          appsCarouselStore.setFocusedAppIndex(index)
        }}
        onDoubleClick={() => {
          appsCarouselStore.scrollToPane(index, true)
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
        transition="box-shadow 200ms ease"
        zIndex={isFocused ? 2 : 1}
        transform={to(
          Object.keys(spring).map(k => spring[k]),
          (x, y, scale, ry) => `translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
        )}
        {...cardProps}
      >
        <AppLoadingScreen definition={definition} app={app} visible={!renderApp} />
        <OrbitApp
          id={app.id}
          isDisabled={isDisabled}
          identifier={definition.id}
          appDef={definition}
          renderApp={renderApp}
        />
      </Card>
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

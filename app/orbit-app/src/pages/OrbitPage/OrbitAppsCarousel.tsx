import { always, AppDefinition, AppIcon, AppWithDefinition, createUsableStore, ensure, react, shallow, Templates, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, idFn, Row, useDebounce, useIntersectionObserver, useNodeSize, useOnMount, useParentNodeSize, useTheme, View } from '@o/ui'
import { debounce } from 'lodash'
import React, { memo, useEffect, useRef, useState } from 'react'
import { to, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { om } from '../../om/om'
import { queryStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'

const scaler = (prevMin: number, prevMax: number, newMin: number, newMax: number) => (x: number) =>
  ((newMax - newMin) * (x - prevMin)) / (prevMax - prevMin) + newMin

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
  )

  // listen for pane movement
  scrollToPane = (id: number, shouldZoomIn?: boolean) => {
    if (shouldZoomIn) {
      this.zoomIntoNextApp = true
    }
    const paneIndex = this.apps.findIndex(x => x.app.id === id)
    if (paneIndex > -1) {
      this.animateAndScrollTo(paneIndex)
      // TODO make this a proper chain
      if (this.zoomIntoNextApp) {
        this.setZoomedOut(false)
      }
    }
  }

  shouldZoomIn() {
    this.zoomIntoNextApp = true
  }

  scrollToSearchedApp = react(
    () => queryStore.queryInstant,
    async (query, { sleep }) => {
      await sleep(40)
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

  filterQueryOnZoomOut = react(
    () => this.state.zoomedOut,
    zoomedOut => {
      if (zoomedOut) {
        // ignore until we next clear the querybar
        queryStore.setPrefixFirstWord()
      }
    },
  )

  stopIgnoringQueriesOnZoomIn = react(
    () => queryStore.hasQuery,
    hasQuery => {
      if (!this.state.zoomedOut && !hasQuery) {
        // if youre zoomed into an app and you clear the query bar,
        // we should stop ignoring the prefix we used previosuly
        queryStore.setPrefixFirstWord(false)
      }
    },
  )

  triggerScrollToFocused = 0

  focusedAppIndex = 0
  setFocusedAppIndex(next: number, forceScroll = false) {
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

  zoomIntoApp(index = Math.round(this.state.index)) {
    this.setFocusedAppIndex(index, true)
    this.setZoomedOut(false)
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
    this.finishScroll()
  }

  // after scroll, select focused card
  finishScroll = debounce(() => {
    this.setFocusedAppIndex(Math.round(this.state.index))
  }, 100)

  outScaler = scaler(0, 1, 0.75, 0.85)
  inScaler = scaler(0, 1, 0.9, 1)

  getSpring = (i: number) => {
    const importance = Math.min(1, Math.max(0, 1 - Math.abs(this.state.index - i)))
    const scaler = this.state.zoomedOut ? this.outScaler : this.inScaler
    const scale = scaler(importance)
    const ry = (this.state.index - i) * 10
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
}

export const appsCarousel = createUsableStore(OrbitAppsCarouselStore)
export const useAppsCarousel = appsCarousel.useStore
window['appsCarousel'] = appsCarousel

export const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const frameRef = useRef<HTMLElement>(null)
  const frameSize = useNodeSize({ ref: frameRef })
  const rowRef = useRef<HTMLElement>(null)
  const rowSize = useParentNodeSize({ ref: rowRef })
  // animation spring
  // fixing bug in react-spring
  const [mounted, setMounted] = useState(false)

  useOnMount(() => {
    setMounted(true)
  })

  const [scrollSpring, setScrollSpring] = useSpring(() => ({
    x: 0,
  }))

  const [springs, setCarouselSprings] = useSprings(mounted ? apps.length : apps.length + 1, i => ({
    ...appsCarousel.getSpring(i),
    config: { mass: 1, tension: 300, friction: 30 },
  }))

  useEffect(() => {
    appsCarousel.setProps({
      apps,
      setCarouselSprings,
      setScrollSpring,
      rowWidth: rowSize.width,
    })
  }, [apps, setScrollSpring, setCarouselSprings, rowSize])

  const bind = useGesture({
    onDrag: appsCarousel.onDrag,
  })

  return (
    <View width="100%" height="100%" overflow="hidden" ref={frameRef}>
      <Row
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        scrollable="x"
        onWheel={() => {
          if (appsCarousel.state.zoomedOut) {
            appsCarousel.animateTo(rowRef.current.scrollLeft / rowSize.width)
          }
        }}
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
            width={frameSize.width}
            height={frameSize.height}
            transform={to(
              Object.keys(springs[index]).map(k => springs[index][k]),
              (x, y, scale, ry) => `translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
            )}
          />
        ))}
      </Row>
    </View>
  )
})

/**
 * Handles visibility of the app as it moves in and out of viewport
 */
const OrbitAppCard = ({
  app,
  definition,
  index,
  ...cardProps
}: CardProps & {
  index: number
  app: AppBit
  definition: AppDefinition
}) => {
  const theme = useTheme()
  const isFocused = useReaction(() => index === appsCarousel.focusedAppIndex, [index])
  const isFocusZoomed = useReaction(
    () => index === appsCarousel.focusedAppIndex && !appsCarousel.state.zoomedOut,
    [index],
  )
  const cardRef = useRef(null)
  const [renderApp, setRenderApp] = useState(false)

  // debounce + wait for idle to avoid frame loss
  const setRenderTrue = useDebounce(async () => {
    await whenIdle()
    setRenderApp(true)
  }, 500)

  useIntersectionObserver({
    ref: cardRef,
    onChange(x) {
      if (x.length && x[0].isIntersecting && !renderApp) {
        setRenderTrue()
      }
    },
  })

  return (
    <Card
      ref={cardRef}
      alt="flat"
      background={theme.backgroundStronger}
      overflow="hidden"
      borderRadius={isFocusZoomed ? 0 : 12}
      animated
      onClick={() => {
        appsCarousel.setFocusedAppIndex(index)
      }}
      onDoubleClick={() => {
        appsCarousel.zoomIntoApp(index)
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
      {...cardProps}
    >
      <AppLoadingScreen definition={definition} app={app} visible={!renderApp} />
      <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp={renderApp} />
    </Card>
  )
}

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

import { AppDefinition, AppIcon, AppWithDefinition, createUsableStore, ensure, react, Templates, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, idFn, Row, useDebounce, useIntersectionObserver, useNodeSize, useOnMount, useParentNodeSize, useTheme, View } from '@o/ui'
import { debounce } from 'lodash'
import React, { memo, useEffect, useRef, useState } from 'react'
import { interpolate, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { paneManagerStore, queryStore } from '../../om/stores'
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

  get apps() {
    return this.props.apps
  }

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.app.name} ${x.definition.id}`,
      id: x.app.id,
    }))
  }

  handleZoomOut = react(
    () => this.zoomedOut,
    () => {
      this.props.setCarouselSprings(appsCarousel.getSpring)
    },
    {
      lazy: true,
    },
  )

  // listen for pane movement
  scrollToPane = react(
    () => +paneManagerStore.activePane.id,
    id => {
      const paneIndex = this.apps.findIndex(x => x.app.id === id)
      if (paneIndex > -1) {
        this.animateAndScrollTo(paneIndex)
        if (appsCarousel.zoomOutAfterMove) {
          appsCarousel.setZoomedOut(false)
        }
      }
    },
    {
      lazy: true,
    },
  )

  scrollToSearchedApp = react(
    () => queryStore.queryInstant,
    async (query, { sleep }) => {
      await sleep(40)
      ensure('has apps', !!this.apps.length)
      ensure('zoomed out', this.zoomedOut)
      if (query.indexOf(' ') > -1) {
        // searching within app
        const [_, firstWord] = query.split(' ')
        if (firstWord.trim().length) {
          this.zoomedOut = false
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
    () => this.zoomedOut,
    zoomedOut => {
      if (zoomedOut) {
        // ignore until we next clear the querybar
        queryStore.setIgnorePrefix()
      }
    },
  )

  stopIgnoringQueriesOnZoomIn = react(
    () => queryStore.hasQuery,
    hasQuery => {
      if (!this.zoomedOut && !hasQuery) {
        // if youre zoomed into an app and you clear the query bar,
        // we should stop ignoring the prefix we used previosuly
        queryStore.setIgnorePrefix(false)
      }
    },
  )

  triggerScrollToFocused = 0

  focusedAppIndex = 0
  setFocusedAppIndex(next: number, forceScroll = false) {
    if (next !== this.focusedAppIndex) {
      this.focusedAppIndex = next
      if (forceScroll) {
        this.animateAndScrollTo(this.focusedAppIndex)
      }
    }
  }

  zoomIntoApp(index = Math.round(this.curI)) {
    this.setFocusedAppIndex(index, true)
    this.setZoomedOut(false)
  }

  zoomOutAfterMove = false
  zoomedOut = true
  setZoomedOut(next: boolean = true) {
    this.zoomedOut = next
    this.zoomOutAfterMove = false
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
    if (this.curI !== index) {
      const paneIndex = Math.round(index)
      if (paneIndex !== this.focusedAppIndex) {
        this.setFocusedAppIndex(paneIndex)
      }
      this.curI = index
      this.props.setCarouselSprings(this.getSpring)
    }
  }

  animateAndScrollTo = (index: number) => {
    if (Math.round(index) !== this.focusedAppIndex) {
      this.setFocusedAppIndex(index)
    }
    const x = this.props.rowWidth * index
    console.log('setting scroll spring', index, x)
    this.props.setScrollSpring({ x })
    this.animateCardsTo(index)
  }

  isControlled = false
  animateTo = (index: number) => {
    appsCarousel.isControlled = true
    appsCarousel.animateCardsTo(index)
    appsCarousel.finishScroll()
  }

  // after scroll, select focused card
  finishScroll = debounce(() => {
    appsCarousel.setFocusedAppIndex(Math.round(appsCarousel.curI))
  }, 100)

  curI = 0
  isDragging = false

  outScaler = scaler(0, 1, 0.75, 0.85)
  inScaler = scaler(0, 1, 0.9, 1)

  getSpring = (i: number) => {
    const importance = Math.min(1, Math.max(0, 1 - Math.abs(this.curI - i)))
    const scaler = appsCarousel.zoomedOut ? this.outScaler : this.inScaler
    const scale = scaler(importance)
    const ry = (this.curI - i) * 10
    return {
      x: 0,
      y: 0,
      scale: scale * (this.isDragging ? 0.95 : 1),
      ry,
    }
  }

  onDrag = next => {
    if (!this.zoomedOut) return

    this.isDragging = next.dragging
    this.props.setCarouselSprings(this.getSpring)

    const dx = -next.velocity * next.direction[0] * 15
    // console.log('next', next)

    // avoid easy presses
    if (Math.abs(dx) < 0.5) return

    if (this.isDragging) {
      const dI = dx / this.props.rowWidth
      const nextI = Math.min(Math.max(0, this.curI + dI), this.apps.length - 1)
      this.animateAndScrollTo(nextI)
    } else {
      const paneIndex = Math.round(this.curI)
      this.animateAndScrollTo(paneIndex)
    }
  }
}

export const appsCarousel = createUsableStore(OrbitAppsCarouselStore)
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
          appsCarousel.animateTo(rowRef.current.scrollLeft / rowSize.width)
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
            transform={interpolate(
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
    () => index === appsCarousel.focusedAppIndex && !appsCarousel.zoomedOut,
    [index],
  )
  const cardRef = useRef(null)
  const [renderApp, setRenderApp] = useState(false)

  // debounce + wait for idle to avoid frame loss
  const setRenderTrue = useDebounce(async () => {
    await whenIdle()
    setRenderApp(true)
  }, 200)

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

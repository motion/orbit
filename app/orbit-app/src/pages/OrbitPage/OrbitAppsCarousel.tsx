import { AppDefinition, AppWithDefinition, createUsableStore, ensure, react, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, Row, useDebounce, useIntersectionObserver, useNodeSize, useOnMount, useParentNodeSize, useTheme, View } from '@o/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { interpolate, useSpring, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'

import { queryStore, usePaneManagerStore } from '../../om/stores'
import { OrbitApp, whenIdle } from './OrbitApp'

class OrbitAppsCarouselStore {
  apps: AppWithDefinition[] = []

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.app.name} ${x.definition.id}`,
      id: x.app.id,
    }))
  }

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
        this.triggerScrollToFocused = Date.now()
      }
    }
  }

  zoomIntoApp(index = Math.round(this.curI)) {
    this.setFocusedAppIndex(index, true)
    this.setZoomedOut(false)
  }

  zoomedOut = true
  setZoomedOut(next: boolean = true) {
    this.zoomedOut = next
  }

  setApps(next: AppWithDefinition[]) {
    this.apps = next
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

  curI = 0
  isDragging = false

  getSpring = (i: number) => {
    const zoom = appsCarousel.zoomedOut ? 0.85 : 1
    const importance = Math.max(0, 1 - Math.abs(this.curI - i))
    const scale = Math.max(0.75, importance * zoom)
    const ry = (this.curI - i) * 10
    return {
      x: 0,
      y: 0,
      scale: scale * (this.isDragging ? 0.93 : 1),
      ry,
    }
  }
}

export const appsCarousel = createUsableStore(OrbitAppsCarouselStore)
window['appsCarousel'] = appsCarousel

export const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  useEffect(() => {
    appsCarousel.setApps(apps)
  }, [apps])

  const paneStore = usePaneManagerStore()
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

  const [scrollSpring, setScroll] = useSpring(() => ({
    x: 0,
  }))

  const [springs, set] = useSprings(mounted ? apps.length : apps.length + 1, i => ({
    ...appsCarousel.getSpring(i),
    config: { mass: 2, tension: 700, friction: 30 },
  }))

  const setCurIndexAndAnimate = (next: number) => {
    if (appsCarousel.curI !== next) {
      const paneIndex = Math.round(next)
      if (paneIndex !== appsCarousel.focusedAppIndex) {
        appsCarousel.setFocusedAppIndex(paneIndex)
      }
      appsCarousel.curI = next
      set(appsCarousel.getSpring)
    }
  }

  const scrollToCurIndexAndAnimate = (index: number) => {
    if (Math.round(index) !== appsCarousel.focusedAppIndex) {
      appsCarousel.setFocusedAppIndex(index)
    }
    setScroll({ x: rowSize.width * index })
    setCurIndexAndAnimate(index)
  }

  const bind = useGesture({
    onDrag: next => {
      if (!appsCarousel.zoomedOut) return

      appsCarousel.isDragging = next.dragging
      set(appsCarousel.getSpring)

      const dx = -next.velocity * next.direction[0] * 15
      // console.log('next', next)

      // avoid easy presses
      if (Math.abs(dx) < 0.5) return

      if (appsCarousel.isDragging) {
        const dI = dx / rowSize.width
        const nextI = Math.min(Math.max(0, appsCarousel.curI + dI), apps.length - 1)
        scrollToCurIndexAndAnimate(nextI)
      } else {
        const paneIndex = Math.round(appsCarousel.curI)
        scrollToCurIndexAndAnimate(paneIndex)
      }
    },
  })

  useReaction(
    () => appsCarousel.zoomedOut,
    () => {
      set(appsCarousel.getSpring)
    },
  )

  useReaction(
    () => appsCarousel.triggerScrollToFocused,
    () => {
      scrollToCurIndexAndAnimate(appsCarousel.focusedAppIndex)
    },
    {
      lazy: true,
    },
    [rowSize],
  )

  // listen for pane movement
  const curAppId = +paneStore.activePane.id
  useEffect(() => {
    const scrollToApp = (appId: number) => {
      const paneIndex = apps.findIndex(x => x.app.id === appId)
      scrollToCurIndexAndAnimate(paneIndex)
    }
    scrollToApp(curAppId)
  }, [curAppId, rowSize.width])

  const finishScroll = useDebounce(() => {
    appsCarousel.setFocusedAppIndex(Math.round(appsCarousel.curI))
  }, 50)

  return (
    <View width="100%" height="100%" overflow="hidden" ref={frameRef}>
      <Row
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        scrollable="x"
        onWheel={() => {
          setCurIndexAndAnimate(rowRef.current.scrollLeft / rowSize.width)
          finishScroll()
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
  const isFocused = useReaction(() => index === appsCarousel.focusedAppIndex, _ => _, [index])
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
      // alt="flat"
      background={theme.backgroundStronger}
      padding
      overflow="hidden"
      title={app.name}
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
              [0, 0, 0, 3, theme.alternates.selected.background],
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
      <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp={renderApp} />
    </Card>
  )
}

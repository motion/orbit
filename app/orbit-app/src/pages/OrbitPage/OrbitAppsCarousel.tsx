import { AppDefinition, AppWithDefinition, createUsableStore, ensure, react, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, Row, useGet, useIntersectionObserver, useOnMount, useParentNodeSize, useTheme, useWindowSize } from '@o/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { interpolate, useSpring, useSprings } from 'react-spring'

import { queryStore, usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

class OrbitAppsCarouselStore {
  apps: AppWithDefinition[] = []

  get searchableApps() {
    return this.apps.map(x => ({
      name: `${x.app.name} ${x.definition.id}`,
      id: x.app.id,
    }))
  }

  scrollToSearchedApp = react(
    () => queryStore.query,
    query => {
      ensure('has apps', !!this.apps.length)
      const searchedApp = fuzzyFilter(query, this.searchableApps)[0]
      const curId = searchedApp ? searchedApp.id : this.apps[0].app.id
      const appIndex = this.apps.findIndex(x => x.app.id === curId)
      this.setFocusedAppIndex(appIndex, true)
    },
  )

  triggerScrollToFocused = 0

  focusedAppIndex = 0
  setFocusedAppIndex(next: number, forceScroll = false) {
    this.focusedAppIndex = next
    if (forceScroll) {
      this.triggerScrollToFocused = Date.now()
    }
  }

  zoomedOut = true
  setZoomedOut(next: boolean) {
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
}

// this is a global and needs to be fast so lets just do this
let curPos = 0

const getSpring = (paneIndex: number) => {
  return {
    x: 0,
    y: 0,
    scale: 1,
    ry: (curPos - paneIndex) * 10,
  }
}

export const orbitAppsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
window['orbitAppsCarouselStore'] = orbitAppsCarouselStore

export const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  useEffect(() => {
    orbitAppsCarouselStore.setApps(apps)
  }, [apps])

  const paneStore = usePaneManagerStore()
  const [sWidth, sHeight] = useWindowSize()
  const [width, height] = [sWidth * 0.8, sHeight * 0.8]
  const rowRef = useRef(null)
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

  useReaction(
    () => orbitAppsCarouselStore.zoomedOut,
    zoomedOut => {
      if (zoomedOut) {
      }
    },
  )

  const [springs, set] = useSprings(mounted ? apps.length : apps.length + 1, i => ({
    ...getSpring(i),
    config: { mass: 1 + i * 2, tension: 700 - i * 100, friction: 30 + i * 20 },
  }))

  const scrollToPaneIndex = (next: number) => {
    if (curPos !== next) {
      const paneIndex = Math.round(next)
      if (paneIndex !== orbitAppsCarouselStore.focusedAppIndex) {
        orbitAppsCarouselStore.setFocusedAppIndex(paneIndex)
      }
      curPos = next
      set(getSpring)
    }
  }

  useReaction(
    () => orbitAppsCarouselStore.triggerScrollToFocused,
    () => {
      setScroll({ x: rowSize.width * orbitAppsCarouselStore.focusedAppIndex })
      scrollToPaneIndex(orbitAppsCarouselStore.focusedAppIndex)
    },
    {
      lazy: true,
    },
    [rowSize],
  )

  const paneWidth = rowSize.width / apps.length
  const getPaneWidth = useGet(paneWidth)

  const curAppId = +paneStore.activePane.id

  // listen for pane movement
  useEffect(() => {
    const scrollToApp = (appId: number) => {
      const pw = getPaneWidth()
      const paneIndex = apps.findIndex(x => x.app.id === appId)
      if (paneIndex !== -1) {
        const x = pw * paneIndex
        scrollToPaneIndex(x === 0 ? 0 : x / rowSize.width)
      }
    }
    scrollToApp(curAppId)
  }, [curAppId, rowSize.width])

  return (
    <Row
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      scrollable="x"
      onWheel={() => {
        scrollToPaneIndex(rowRef.current.scrollLeft / rowSize.width)
      }}
      scrollLeft={scrollSpring.x}
      animated
      space
      padding
      ref={rowRef}
      perspective="600px"
    >
      {apps.map(({ app, definition }, index) => (
        <OrbitAppCard
          key={app.id}
          index={index}
          app={app}
          definition={definition}
          width={width}
          height={height}
          transform={interpolate(
            Object.keys(springs[index]).map(k => springs[index][k]),
            (x, y, scale, ry) => `translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${ry}deg)`,
          )}
        />
      ))}
    </Row>
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
  const isFocused = useReaction(() => index === orbitAppsCarouselStore.focusedAppIndex, _ => _, [
    index,
  ])
  const cardRef = useRef(null)
  const [renderApp, setRenderApp] = useState(false)
  useIntersectionObserver({
    ref: cardRef,
    onChange(x) {
      if (x.length && x[0].isIntersecting && !renderApp) {
        setRenderApp(true)
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

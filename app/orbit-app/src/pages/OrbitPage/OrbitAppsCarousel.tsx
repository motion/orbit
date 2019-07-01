import { always, AppDefinition, AppWithDefinition, createUsableStore, react, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, Row, useGet, useIntersectionObserver, useOnMount, useParentNodeSize, useTheme, useWindowSize } from '@o/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { interpolate, useSprings } from 'react-spring'

import { usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

class OrbitAppsCarouselStore {
  apps: AppWithDefinition[] = []
  query = ''
  results = react(() => always(this.apps, this.query), this.getResults)

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

  setQuery(x: string) {
    this.query = x
  }

  getResults() {
    return fuzzyFilter(this.query, this.apps)
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

  useReaction(
    () => orbitAppsCarouselStore.triggerScrollToFocused,
    () => {
      rowRef.current.scrollLeft = rowSize.width * orbitAppsCarouselStore.focusedAppIndex
    },
    {
      lazy: true,
    },
    [rowSize],
  )

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

  const scrollTo = (next: number) => {
    if (curPos !== next) {
      const paneIndex = Math.round(next)
      if (paneIndex !== orbitAppsCarouselStore.focusedAppIndex) {
        orbitAppsCarouselStore.setFocusedAppIndex(paneIndex)
      }
      curPos = next
      set(getSpring)
    }
  }

  const paneWidth = rowSize.width / apps.length
  const getPaneWidth = useGet(paneWidth)

  const curAppId = +paneStore.activePane.id

  // listen for pane movement
  useEffect(() => {
    const scrollToPane = (appId: number) => {
      const pw = getPaneWidth()
      const paneIndex = apps.findIndex(x => x.app.id === appId)
      if (paneIndex !== -1) {
        const x = pw * paneIndex
        scrollTo(x === 0 ? 0 : x / rowSize.width)
      }
    }
    scrollToPane(curAppId)
  }, [curAppId, rowSize.width])

  return (
    <Row
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      scrollable="x"
      onWheel={() => {
        scrollTo(rowRef.current.scrollLeft / rowSize.width)
      }}
      scrollX={springs[0].x}
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

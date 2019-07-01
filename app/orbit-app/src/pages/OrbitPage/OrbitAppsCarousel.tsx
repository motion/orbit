import { always, AppDefinition, AppWithDefinition, createUsableStore, react, useReaction } from '@o/kit'
import { AppBit } from '@o/models'
import { Card, CardProps, fuzzyFilter, Row, useGet, useIntersectionObserver, useOnMount, useParentNodeSize, useWindowSize } from '@o/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { interpolate, useSprings } from 'react-spring'

import { usePaneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

class OrbitAppsCarouselStore {
  apps: AppWithDefinition[] = []
  query = ''
  results = react(() => always(this.apps, this.query), this.getResults)

  focusedAppIndex = 0
  setFocusedAppIndex(next: number) {
    this.focusedAppIndex = next
  }

  zoomedOut = false
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
}

export const orbitAppsCarouselStore = createUsableStore(OrbitAppsCarouselStore)
window['orbitAppsCarouselStore'] = orbitAppsCarouselStore

export const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const store = orbitAppsCarouselStore.useStore()

  useEffect(() => {
    store.setApps(apps)
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

  const [springs, set] = useSprings(mounted ? apps.length : apps.length + 1, i => ({
    x: i * 30,
    y: 0,
    ry: -i * 50,
    config: { mass: 1 + i * 2, tension: 700 - i * 100, friction: 30 + i * 20 },
  }))

  const scrollTo = (paneIndexPrecise: number) => {
    console.log('paneIndexPrecise', paneIndexPrecise)

    const paneIndex = Math.round(paneIndexPrecise)
    if (paneIndex !== orbitAppsCarouselStore.focusedAppIndex) {
      orbitAppsCarouselStore.setFocusedAppIndex(paneIndex)
    }

    // @ts-ignore
    set(i => {
      return {
        x: paneIndexPrecise * i * 20,
        y: 0,
        ry: paneIndexPrecise * i * 10,
      }
    })
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
            (x, y, ry) =>
              `translate3d(${x}px,${y}px,0) scale(${1 - index * 0.05}) rotateY(${ry}deg)`,
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
  const isFocused = useReaction(() => index === orbitAppsCarouselStore.focusedAppIndex, _ => _, [
    index,
  ])
  console.log('index', index, isFocused)
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
      background={theme => theme.backgroundStronger}
      padding
      overflow="hidden"
      title={app.name}
      animated
      borderColor={isFocused ? 'red' : undefined}
      {...cardProps}
    >
      <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp={renderApp} />
    </Card>
  )
}

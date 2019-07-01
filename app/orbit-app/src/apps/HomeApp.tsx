import { always, AppBit, AppMainView, createApp, react, useActiveClientApps, useSearchState, useStore } from '@o/kit'
import { Card, fuzzyFilter, Row, useParentNodeSize, useWindowSize } from '@o/ui'
import React, { useRef, useState } from 'react'
import { animated, useSprings } from 'react-spring'

export default createApp({
  id: 'home',
  icon: 'home',
  name: 'Home',
  app: HomeApp,
})

function HomeApp() {
  const apps = useActiveClientApps().filter(x => x.tabDisplay !== 'permanent')
  const homeStore = useStore(HomeStore, { apps })
  const [sWidth, sHeight] = useWindowSize()
  const [width, height] = [sWidth * 0.8, sHeight * 0.8]
  const activeApp = homeStore.results[0] || apps[0]
  const rowRef = useRef(null)
  const rowSize = useParentNodeSize({ ref: rowRef })

  const [springs, set] = useSprings(apps.length, i => ({
    xyz: [i * 20, 0, -i * 20],
    config: { mass: 1 + i * 2, tension: 700 - i * 100, friction: 30 + i * 20 },
  }))
  const transform = i =>
    springs[i].xyz.interpolate(
      (x, y, z) => `translate3d(${x}px,${y}px,0) scale(${1 - i * 0.05}) rotateZ(${z}deg)`,
    )

  const animateItems = ({ target }) => {
    const pct = target.scrollLeft / rowSize.width
    console.log('scroll', pct, rowSize)
    set(i => ({ xyz: [pct * i * 20, 0, pct * i * 10] }))
  }

  useSearchState(state => {
    homeStore.setQuery(state.query)
  })

  return (
    <Row
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      scrollable="x"
      space
      pad
      onScroll={animateItems}
      ref={rowRef}
    >
      {apps.map((app, index) => (
        <animated.div key={app.id} style={{ transform: transform(index), width, height }}>
          <Card
            alt="flat"
            background={theme => theme.backgroundStronger}
            pad
            width={width}
            height={height}
            overflow="hidden"
            title={app.name}
          >
            <AppMainView identifier={app.identifier} id={`${app.id}`} />
          </Card>
        </animated.div>
      ))}
    </Row>
  )
}

class HomeStore {
  props: {
    apps: AppBit[]
  }

  query = ''
  setQuery = x => (this.query = x)

  results = react(() => always(this.props.apps, this.query), this.getResults)

  getResults() {
    return fuzzyFilter(this.query, this.props.apps)
  }
}

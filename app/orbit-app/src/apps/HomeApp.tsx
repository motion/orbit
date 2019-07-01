import { always, AppBit, AppMainView, createApp, react, useActiveClientApps, useSearchState, useStore } from '@o/kit'
import { Card, fuzzyFilter, Row, useWindowSize } from '@o/ui'
import React from 'react'

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

  useSearchState(state => {
    homeStore.setQuery(state.query)
  })

  return (
    <Row flex={1} alignItems="center" justifyContent="flex-start" scrollable="x" space pad>
      {apps.map(app => (
        <Card
          key={app.id}
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

import * as React from 'react'
import { view } from '@mcro/black'
import { Orbit } from './orbit/Orbit'
import { OrbitStore } from './OrbitStore'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'

@view.provide({
  appsStore: AppsStore,
  orbitStore: OrbitStore,
})
export class OrbitPage extends React.Component<{
  appsStore: AppsStore
  orbitStore: OrbitStore
}> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          {/* <HighlightsPage /> */}
          <Orbit />
          {/* <Peek /> */}
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}

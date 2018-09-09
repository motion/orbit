import * as React from 'react'
import { view } from '@mcro/black'
import { Orbit } from './orbit/Orbit'
import { AppStore } from './AppStore'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../views'

@view.provide({
  appsStore: AppsStore,
  appStore: AppStore,
})
export class OrbitPage extends React.Component<{
  appsStore: AppsStore
  appStore: AppStore
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

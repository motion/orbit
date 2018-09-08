import * as React from 'react'
import { view } from '@mcro/black'
// import { HighlightsPage } from './HighlightsPage'
import { Orbit } from './orbit/Orbit'
import { Peek } from './peek/Peek'
import { AppStore } from './AppStore'
import * as UI from '@mcro/ui'
import { AppsStore } from './AppsStore'
import { MainShortcutHandler } from '../components/shortcutHandlers/MainShortcutHandler'

const Main = view(UI.Col, {
  // background: [0, 0, 0, 0.1],
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  position: 'relative',
})

@view.provide({
  appsStore: AppsStore,
  appStore: AppStore,
})
export class MainPage extends React.Component<{
  appsStore: AppsStore
  appStore: AppStore
}> {
  render() {
    return (
      <MainShortcutHandler>
        <Main>
          {/* <HighlightsPage /> */}
          <Orbit />
          <Peek />
        </Main>
      </MainShortcutHandler>
    )
  }
}

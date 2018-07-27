import * as React from 'react'
import { view } from '@mcro/black'
// import { HighlightsPage } from './HighlightsPage'
import { Orbit } from './orbit/Orbit'
import { Peek } from './peek/Peek'
import { AppStore } from '../stores/AppStore'
import * as UI from '@mcro/ui'
import { IntegrationSettingsStore } from '../stores/IntegrationSettingsStore'
import { SearchStore } from '../stores/SearchStore'

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
  integrationSettingsStore: IntegrationSettingsStore,
  appStore: AppStore,
})
@view.provide({
  searchStore: SearchStore, // Peek and Orbit both can use search store
})
export class MainPage extends React.Component<{
  integrationSettingsStore: IntegrationSettingsStore
  appStore: AppStore
}> {
  render() {
    return (
      <Main>
        {/* <HighlightsPage /> */}
        <Orbit />
        <Peek />
      </Main>
    )
  }
}

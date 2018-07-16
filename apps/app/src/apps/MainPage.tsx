import * as React from 'react'
import { view } from '@mcro/black'
// import { HighlightsPage } from './HighlightsPage'
import { OrbitPage } from './OrbitPage'
import { PeekPage } from './PeekPage'
import { AppStore } from '../stores/AppStore'
import * as UI from '@mcro/ui'
import { SearchFilterStore } from '../stores/SearchFilterStore'
import { IntegrationSettingsStore } from '../stores/IntegrationSettingsStore'

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
  searchFilterStore: SearchFilterStore,
  appStore: AppStore,
})
export class MainPage extends React.Component<{
  integrationSettingsStore: IntegrationSettingsStore
  searchFilterStore: SearchFilterStore
  appStore: AppStore
}> {
  componentWillMount() {
    this.props.searchFilterStore.integrationSettingsStore = this.props.integrationSettingsStore
  }

  render() {
    return (
      <Main>
        {/* <HighlightsPage /> */}
        <OrbitPage />
        <PeekPage />
      </Main>
    )
  }
}

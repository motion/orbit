import * as React from 'react'
import { view } from '@mcro/black'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppStore } from './AppStore'
import * as UI from '@mcro/ui'
import { SelectionStore } from '../OrbitPage/orbitDocked/SelectionStore'
import { AppFrame } from './AppFrame'
import { AppBitView } from '../../apps/AppBitView'
import { Searchable } from '@mcro/ui'
import { App } from '@mcro/stores'

type Props = {
  appsStore?: AppsStore
  appStore?: AppStore
  selectionStore?: SelectionStore
}

@view.attach('searchStore')
@view.provide({
  appsStore: AppsStore,
})
@view.provide({
  appStore: AppStore,
})
export class AppPage extends React.Component<Props> {
  render() {
    return (
      <MainShortcutHandler>
        <AppWrapper>
          <UI.Theme name="light">
            <AppFrame>
              <AppPageContent />
            </AppFrame>
          </UI.Theme>
        </AppWrapper>
      </MainShortcutHandler>
    )
  }
}

const NullView = () => <div>null</div>

@view.attach('appsStore', 'selectionStore', 'appStore')
@view
class AppPageContent extends React.Component<Props> {
  viewsByType = {
    bit: () => {
      const { appStore, appsStore } = this.props
      const { appConfig, model } = appStore.state
      const app = appsStore.allAppsObj[appConfig.integration]
      if (!app) {
        console.log('no app', appConfig, appStore)
        return NullView
      }
      const View = app.views.main
      return props => (
        <AppBitView>
          <View key={appConfig.id} bit={model} appStore={appStore} {...props} />
        </AppBitView>
      )
    },
  }

  render() {
    const { appStore, selectionStore } = this.props
    if (!appStore.state) {
      return null
    }
    const { appConfig } = appStore.state
    const TypeView = this.viewsByType[appConfig.type]() || NullView
    // ideally this would be different:
    // you'd have a AppSearchable + AppSearchable.Input, and you could use them lower down the tree
    // but that requires some custom context and time we dont have just yet
    return (
      <Searchable
        key={appConfig.id}
        defaultValue={App.state.query}
        // focusOnMount
        // onEnter={peekStore.goToNextHighlight}
        onChange={() => selectionStore.setHighlightIndex(0)}
        width={150}
        searchBarProps={{
          flex: 1,
          // 1px more for inset shadow
          padding: [3, 0],
        }}
      >
        {({ searchBar, searchTerm }) => {
          return <TypeView searchBar={searchBar} searchTerm={searchTerm} />
        }}
      </Searchable>
    )
  }
}

import * as React from 'react'
import { view } from '@mcro/black'
import { AppsStore } from '../../stores/AppsStore'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppStore } from './AppStore'
import * as UI from '@mcro/ui'
import { AppFrame } from './AppFrame'
import { AppBitView } from '../../apps/AppBitView'
import { App } from '@mcro/stores'
import { normalizeItem } from '../../components/ItemResolver'
import { WindowControls } from '../../views/WindowControls'
import { AppSearchable } from '../../apps/views/AppSearchable'

type Props = {
  appsStore?: AppsStore
  appStore?: AppStore
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
const HiddenControls = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  opacity: 0,
  padding: [6, 4, 6],
  zIndex: 1000,
  '&:hover': {
    opacity: 1,
  },
})

@view.attach('appsStore', 'appStore')
@view
class AppPageContent extends React.Component<Props> {
  viewsByType = {
    bit: () => {
      const { appStore, appsStore } = this.props
      const { appConfig, model } = appStore.state
      const app = appsStore.allAppsObj[appConfig.integration]
      if (!app) {
        return NullView
      }
      const View = app.views.main
      return props => (
        <AppBitView>
          <View key={appConfig.id} bit={model} appStore={appStore} {...props} />
        </AppBitView>
      )
    },
    person: () => {
      return props => <div>person</div>
    },
    setting: () => {
      return props => <div>setting</div>
    },
    app: () => {
      return props => <div>app</div>
    },
  }

  render() {
    const { appStore } = this.props
    if (!appStore.state) {
      return null
    }
    const { model, appConfig } = appStore.state
    console.log('appConfig.type', appConfig.type, 'App.state.query', App.state.query)
    const TypeView = this.viewsByType[appConfig.type]() || NullView
    // ideally this would be different:
    // you'd have a AppSearchable + AppSearchable.Input, and you could use them lower down the tree
    // but that requires some custom context and time we dont have just yet
    return (
      <>
        <HiddenControls>
          <WindowControls
            onClose={appStore.handleClose}
            onMax={appStore.isTorn ? appStore.handleMaximize : null}
            onMin={appStore.isTorn ? appStore.handleMinimize : null}
            itemProps={{
              size: 10,
            }}
          />
        </HiddenControls>
        <AppSearchable>
          {({ searchBar, searchTerm }) => (
            <TypeView
              normalizedItem={normalizeItem(model)}
              searchBar={searchBar}
              searchTerm={searchTerm}
            />
          )}
        </AppSearchable>
      </>
    )
  }
}

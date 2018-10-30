import * as React from 'react'
import { view, provide, attach } from '@mcro/black'
import { AppsStore } from '../../stores/AppsStore'
// import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppStore } from './AppStore'
import * as UI from '@mcro/ui'
import { AppFrame } from './AppFrame'
import { AppBitView } from './AppBitView'
import { App } from '@mcro/stores'
import { normalizeItem } from '../../helpers/normalizeItem'
import { WindowControls } from '../../views/WindowControls'
import { AppSearchable } from '../../integrations/views/apps/AppSearchable'
import { AttachAppInfoStore } from '../../components/AttachAppInfoStore'
import { OrbitIntegration } from '../../integrations/types'
import { allIntegrations } from '../../integrations'

type Props = {
  appsStore?: AppsStore
  appStore?: AppStore
}

@provide({
  appsStore: AppsStore,
})
@provide({
  appStore: AppStore,
})
export class AppPage extends React.Component<Props> {
  render() {
    return (
      // <MainShortcutHandler>
      <AppWrapper>
        <UI.Theme name="light">
          <AppFrame>
            <AppPageContent />
          </AppFrame>
        </UI.Theme>
      </AppWrapper>
      // </MainShortcutHandler>
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
  pointerEvents: 'none',
  '&:hover': {
    opacity: 1,
  },
})

@attach('appsStore', 'appStore')
@view
class AppPageContent extends React.Component<Props> {
  getView = (viewType: keyof OrbitIntegration<any>['views']) => {
    const { appStore, appsStore } = this.props
    const { appConfig } = appStore.state
    const app = appsStore.allSourcesMap[appConfig.integration]
    if (!app) {
      return NullView
    }
    return app.views[viewType]
  }

  viewsByType = {
    bit: () => {
      const { appStore } = this.props
      const View = this.getView('main')
      return view(props => (
        <AppBitView>
          <View bit={appStore.state.model} appStore={appStore} {...props} />
        </AppBitView>
      ))
    },
    'person-bit': () => {
      const { appStore } = this.props
      return view(props => {
        console.log('rendeirn g person-bit', appStore)
        if (!appStore.state.model) {
          return <div>nope</div>
        }
        const View = allIntegrations.person.views.main
        return <View model={appStore.state.model} {...props} />
      })
    },
    setting: () => {
      const { appStore } = this.props
      const View = this.getView('setting')
      return view(props => {
        return (
          <AttachAppInfoStore>
            {appInfoStore => (
              <View
                appConfig={appStore.state.appConfig}
                appInfoStore={appInfoStore}
                setting={appStore.state.model}
                appStore={appStore}
                {...props}
              />
            )}
          </AttachAppInfoStore>
        )
      })
    },
    app: () => {
      return props => <div>app</div>
    },
    setup: () => {
      const View = this.getView('setup')
      return () => <View />
    },
  }

  render() {
    const { appStore } = this.props
    if (!appStore.state) {
      return null
    }
    const { model, appConfig } = appStore.state
    console.log('appConfig.type', appConfig.type, 'App.state.query', App.state.query)
    const getView = this.viewsByType[appConfig.type]
    if (!getView) {
      return <div>error getting view {JSON.stringify(appConfig)}</div>
    }
    if (appConfig.type === 'bit' && !model) {
      return null
    }
    const TypeView = getView() || NullView
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
              normalizedItem={model ? normalizeItem(model) : null}
              searchBar={searchBar}
              searchTerm={searchTerm}
            />
          )}
        </AppSearchable>
      </>
    )
  }
}

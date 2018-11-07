import * as React from 'react'
import { view, provide, attach } from '@mcro/black'
import { SourcesStore } from '../../stores/SourcesStore'
// import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { SpaceEditView } from '../SpaceEditView'
import { ViewStore } from './ViewStore'
import * as UI from '@mcro/ui'
import { AppFrame } from './AppFrame'
import { AppBitView } from './AppBitView'
import { App } from '@mcro/stores'
import { normalizeItem } from '../../helpers/normalizeItem'
import { WindowControls } from '../../views/WindowControls'
import { AppSearchable } from '../../sources/views/apps/AppSearchable'
import { AttachAppInfoStore } from '../../components/AttachAppInfoStore'
import { OrbitIntegration } from '../../sources/types'
import { allIntegrations } from '../../sources'
import { AppView } from '../../apps/AppView'

type Props = {
  sourcesStore?: SourcesStore
  viewStore?: ViewStore
}

@provide({
  sourcesStore: SourcesStore,
})
@provide({
  viewStore: ViewStore,
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

@attach('sourcesStore', 'viewStore')
@view
class AppPageContent extends React.Component<Props> {
  getView = (viewType: keyof OrbitIntegration<any>['views']) => {
    const { viewStore, sourcesStore } = this.props
    const { appConfig } = viewStore.state
    const app = sourcesStore.allSourcesMap[appConfig.integration]
    if (!app) {
      return NullView
    }
    return app.views[viewType]
  }

  viewsByType = {
    bit: () => {
      const { viewStore } = this.props
      const View = this.getView('main')
      return view(props => (
        <AppBitView>
          <View bit={viewStore.state.model} viewStore={viewStore} {...props} />
        </AppBitView>
      ))
    },
    'person-bit': () => {
      const { viewStore } = this.props
      return view(props => {
        console.log('rendeirn g person-bit', viewStore)
        if (!viewStore.state.model) {
          return <div>nope</div>
        }
        const View = allIntegrations.person.views.main
        return <View model={viewStore.state.model} {...props} />
      })
    },
    source: () => {
      const { viewStore } = this.props
      const View = this.getView('setting')
      return view(props => {
        return (
          <AttachAppInfoStore>
            {appInfoStore => (
              <View
                appConfig={viewStore.state.appConfig}
                appInfoStore={appInfoStore}
                source={viewStore.state.model}
                viewStore={viewStore}
                {...props}
              />
            )}
          </AttachAppInfoStore>
        )
      })
    },
    app: () => {
      return () => <div>app</div>
    },
    setup: () => {
      const View = this.getView('setup')
      return () => <View />
    },
    newSpace: () => {
      return () => <SpaceEditView />
    },
    lists: () => () => <AppView id="0" type="lists" view="main" title="" />,
    people: () => () => <AppView id="0" type="people" view="main" title="" />,
    topics: () => () => <AppView id="0" type="topics" view="main" title="" />,
  }

  render() {
    const { viewStore } = this.props
    if (!viewStore.state) {
      return null
    }
    const { model, appConfig } = viewStore.state
    console.log('appConfig.type', appConfig.type, 'App.state.query', App.state.query)
    const getView = this.viewsByType[appConfig.type]
    if (!getView) {
      return (
        <div>
          error getting view
          <br />
          <br />
          Root.stores.ViewStore.state.appConfig: {JSON.stringify(appConfig)}
          <br />
          <br />
          model: {JSON.stringify(model)}
        </div>
      )
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
            onClose={viewStore.handleClose}
            onMax={viewStore.isTorn ? viewStore.handleMaximize : null}
            onMin={viewStore.isTorn ? viewStore.handleMinimize : null}
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

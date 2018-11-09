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
import { AppView } from '../../apps/AppView'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'

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
@provide({
  queryStore: QueryStore,
})
@provide({
  selectionStore: SelectionStore,
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
    list: () => () => <AppView id="0" type="lists" view="main" title="" />,
    people: () => () => <AppView id="0" type="people" view="main" title="" />,
    topics: () => () => <AppView id="0" type="topics" view="main" title="" />,
  }

  render() {
    const { viewStore } = this.props
    if (!viewStore.state) {
      return null
    }
    const { appConfig, appType } = viewStore.state
    if (!appConfig || !appType) {
      return <div>no appConfig or appType</div>
    }
    console.log('appConfig.type', appConfig.type, 'App.state.query', App.state.query)
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
        <AppView id={appConfig.id} view="main" title={appConfig.title} type={appType} isActive />
        {/* <AppSearchable>
          {({ searchBar, searchTerm }) => (
            <TypeView
              normalizedItem={model ? normalizeItem(model) : null}
              searchBar={searchBar}
              searchTerm={searchTerm}
            />
          )}
        </AppSearchable> */}
      </>
    )
  }
}

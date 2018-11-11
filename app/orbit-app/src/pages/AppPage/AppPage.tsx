import * as React from 'react'
import { view, provide, attach } from '@mcro/black'
import { SourcesStore } from '../../stores/SourcesStore'
// import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppPageStore } from './AppPageStore'
import * as UI from '@mcro/ui'
import { AppFrame } from './AppFrame'
import { App } from '@mcro/stores'
import { WindowControls } from '../../views/WindowControls'
import { OrbitIntegration } from '../../sources/types'
import { AppView } from '../../apps/AppView'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'

type Props = {
  sourcesStore?: SourcesStore
  appPageStore?: AppPageStore
}

@provide({
  sourcesStore: SourcesStore,
})
@provide({
  appPageStore: AppPageStore,
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

@attach('sourcesStore', 'appPageStore')
@view
class AppPageContent extends React.Component<Props> {
  getView = (viewType: keyof OrbitIntegration<any>['views']) => {
    const { appPageStore, sourcesStore } = this.props
    const { appConfig } = appPageStore.state
    const app = sourcesStore.allSourcesMap[appConfig.integration]
    if (!app) {
      return NullView
    }
    return app.views[viewType]
  }

  render() {
    const { appPageStore } = this.props
    if (!appPageStore.state) {
      return <div>no state</div>
    }
    const { appConfig, appType } = appPageStore.state
    if (!appConfig || !appType) {
      return <div>no appConfig or appType</div>
    }
    console.log('appConfig.type', appConfig.type, 'App.state.query', App.state.query)
    return (
      <>
        <HiddenControls>
          <WindowControls
            onClose={appPageStore.handleClose}
            onMax={appPageStore.isTorn ? appPageStore.handleMaximize : null}
            onMin={appPageStore.isTorn ? appPageStore.handleMinimize : null}
            itemProps={{
              size: 10,
            }}
          />
        </HiddenControls>
        <AppView id={appConfig.id} view="main" title={appConfig.title} type={appType} isActive />
      </>
    )
  }
}

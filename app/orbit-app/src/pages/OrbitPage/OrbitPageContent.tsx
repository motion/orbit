import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { AppView } from '../../apps/AppView'
import { HandleSelection } from '../../views/ListItems/OrbitItemProps'
import { AppConfig, AppType, App } from '@mcro/models'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { Col, Row, Sidebar, View } from '@mcro/ui'
import { SubPane } from '../../components/SubPane'
import { App as AppGlobalStore } from '@mcro/stores'
import { AppActions } from '../../actions/AppActions'
import { AppStore } from '../../apps/AppStore'
import { observer } from 'mobx-react-lite'
import { SelectionManager } from '../../components/SelectionManager'
import { gloss } from '@mcro/gloss'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { useObserveActiveApps } from '../../hooks/useObserveActiveApps'

class OrbitStore {
  props: { paneManagerStore: PaneManagerStore }

  get activePane() {
    return this.props.paneManagerStore.activePane
  }

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  handleSelectItem: HandleSelection = (index, appConfig) => {
    if (!appConfig) {
      console.warn('no app config', index)
      return
    }
    const type = appConfig.type === 'bit' ? AppType.search : appConfig.type
    this.activeConfig = {
      ...this.activeConfig,
      [type]: appConfig,
    }
  }

  appStores: { [key: string]: AppStore<any> } = {}

  setAppStore = (id: number) => (store: AppStore<any>) => {
    this.appStores = {
      ...this.appStores,
      [id]: store,
    }
  }
}

export const OrbitPageContent = observer(() => {
  const { paneManagerStore } = useStoresSafe()
  const store = useStore(OrbitStore, { paneManagerStore })

  if (!store.activePane) {
    return null
  }

  React.useEffect(() => {
    return AppGlobalStore.onMessage(AppGlobalStore.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePane(101)
    })
  }, [])

  const activeAppStore = store.appStores[store.activePane]
  const activeApps = useObserveActiveApps()

  const allPanes: App[] = [
    ...activeApps,
    {
      target: 'app',
      id: 100,
      type: 'sources',
      name: 'Sources',
      data: {
        icon: 'box',
      },
    },
    {
      target: 'app',
      id: 101,
      type: 'settings',
      name: 'Settings',
      data: {
        icon: 'gear',
      },
    },
  ]

  return (
    <Col flex={1}>
      <ToolbarChrome>{!!activeAppStore ? activeAppStore.toolbar : null}</ToolbarChrome>
      <Row flex={1}>
        <Sidebar width={300} minWidth={100} maxWidth={500}>
          <OrbitIndexView isHidden={false}>
            {allPanes.map(app => (
              <SubPane key={app.type} id={app.id} type={AppType[app.type]} fullHeight>
                <SelectionManager paneId={app.id}>
                  <AppView
                    viewType="index"
                    id={app.id}
                    type={app.type}
                    onSelectItem={store.handleSelectItem}
                    onAppStore={store.setAppStore(app.id)}
                  />
                </SelectionManager>
              </SubPane>
            ))}
          </OrbitIndexView>
        </Sidebar>
        <OrbitMainView>
          {allPanes.map(app => (
            <SubPane key={app.type} id={app.id} type={AppType[app.type]} fullHeight preventScroll>
              <AppView
                isActive
                viewType="main"
                id={app.id}
                type={app.type}
                appConfig={store.activeConfig[app.type]}
              />
            </SubPane>
          ))}
        </OrbitMainView>
      </Row>
    </Col>
  )
})

const ToolbarChrome = gloss({
  minHeight: 3,
  maxHeight: 50,
}).theme((_, theme) => ({
  // borderBottom: [1, theme.borderColor.alpha(0.25)],
  background: theme.background,
}))

const OrbitIndexView = gloss(View, {
  flex: 1,
  position: 'relative',
  isHidden: {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    zIndex: -1,
  },
})
// .theme((_, theme) => ({
//   borderRight: [1, theme.borderColor.alpha(0.5)],
//   background: theme.background.alpha(0.5),
// }))

const OrbitMainView = gloss({
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))

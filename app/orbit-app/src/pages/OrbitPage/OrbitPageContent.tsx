import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { AppView } from '../../apps/AppView'
import { OrbitItemProps } from '../../views/ListItems/OrbitItemProps'
import { AppConfig, AppType } from '@mcro/models'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { Col, Row } from '@mcro/ui'
import { AppPanes } from '../../stores/SpaceStore'
import { SubPane } from '../../components/SubPane'
import { App } from '@mcro/stores'
import { AppActions } from '../../actions/AppActions'
import { AppStore } from '../../apps/AppStore'
import { observer } from 'mobx-react-lite'
import { SelectionManager } from '../../components/SelectionManager'
import { gloss } from '@mcro/gloss'

class OrbitStore {
  props: { paneManagerStore: PaneManagerStore }

  get activePane() {
    return this.props.paneManagerStore.activePane
  }

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: 'search', title: '' },
  }

  handleSelectItem: OrbitItemProps<any>['onSelect'] = (_index, config) => {
    const type = config.type === 'bit' ? 'search' : config.type
    this.activeConfig = {
      ...this.activeConfig,
      [type]: config,
    }
  }

  appStores: { [key: string]: AppStore<any> } = {}

  setAppStore = <T extends AppType>(id: T) => (store: AppStore<T>) => {
    this.appStores = {
      ...this.appStores,
      [id]: store,
    }
  }
}

export const OrbitPageContent = observer(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  const store = useStore(OrbitStore, { paneManagerStore })

  if (!store.activePane) {
    return null
  }

  // TODO make it a reaction inside here using mobx-react-hooks
  // setActivePaneOnTrigger = react(
  //   () => this.props.queryStore.queryInstant[0],
  //   firstChar => {
  //     for (const { type, trigger } of AppPanes) {
  //       if (trigger && trigger === firstChar) {
  //         this.props.paneManagerStore.setActivePane(type)
  //         return
  //       }
  //     }
  //   },
  // )

  React.useEffect(() => {
    return App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePane('settings')
    })
  }, [])

  const activeAppStore = store.appStores[store.activePane]

  const allPanes: AppConfig[] = [
    ...AppPanes,
    {
      id: 'sources',
      type: 'sources',
      title: 'Sources',
      icon: 'box',
    },
    {
      id: 'settings',
      type: 'settings',
      title: 'Settings',
      icon: 'gear',
    },
  ]

  return (
    <Col flex={1}>
      {!!activeAppStore && !!activeAppStore.toolbar ? (
        <ToolbarChrome>{activeAppStore.toolbar}</ToolbarChrome>
      ) : null}
      <Row flex={1}>
        <OrbitIndexView isHidden={store.activePane === 'home'}>
          {allPanes.map(app => (
            <SubPane key={app.type} id={app.id} type={app.type} fullHeight>
              <SelectionManager pane={app.id}>
                <AppView
                  viewType="index"
                  id={app.id}
                  type={app.type}
                  itemProps={{ onSelect: store.handleSelectItem }}
                  onAppStore={store.setAppStore(app.type)}
                />
              </SelectionManager>
            </SubPane>
          ))}
        </OrbitIndexView>
        <OrbitMainView>
          {allPanes.map(app => (
            <SubPane key={app.type} id={app.id} type={app.type} fullHeight preventScroll>
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

const ToolbarChrome = gloss({}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(0.25)],
  background: theme.background,
}))

const OrbitIndexView = gloss({
  width: 300,
  position: 'relative',
  isHidden: {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    zIndex: -1,
  },
}).theme((_, theme) => ({
  borderRight: [1, theme.borderColor.alpha(0.5)],
  background: theme.background.alpha(0.5),
}))

const OrbitMainView = gloss({
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))

import { gloss } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { Col, Row, Sidebar, Text } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppView } from '../../apps/AppView'
import Searchable from '../../components/Searchable'
import MainShortcutHandler from '../../components/shortcutHandlers/MainShortcutHandler'
import { StoreContext } from '../../contexts'
import { useStores } from '../../hooks/useStores'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { AppWrapper, HorizontalSpace } from '../../views'
import { Icon } from '../../views/Icon'
import { WindowControls } from '../../views/WindowControls'
import AppFrame from './AppFrame'
import { AppPageStore } from './AppPageStore'

// see main.ts for setup for testing this in browser

export default React.memo(() => {
  const sourcesStore = useStore(SourcesStore)
  const settingStore = useStore(SettingStore)
  const spaceStore = useStore(SpaceStore)
  const appPageStore = useStore(AppPageStore)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore)
  return (
    <StoreContext.Provider
      value={{
        sourcesStore,
        settingStore,
        spaceStore,
        appPageStore,
        queryStore,
        selectionStore,
      }}
    >
      <MainShortcutHandler>
        <AppWrapper>
          <UI.Theme name="light">
            <AppFrame>
              <AppPageContent />
            </AppFrame>
          </UI.Theme>
        </AppWrapper>
      </MainShortcutHandler>
    </StoreContext.Provider>
  )
})

const TitleBar = gloss({
  height: 32,
  alignItems: 'center',
  flexFlow: 'row',
  padding: [0, 8],
  position: 'relative',
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(alpha => alpha * 0.5)],
}))

const CenteredTitle = gloss({
  position: 'absolute',
  top: 0,
  left: 70,
  right: 70,
  bottom: 0,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

const AppPageContent = observer(() => {
  const { appPageStore, appFrameStore, queryStore } = useStores()
  if (!appPageStore.state) {
    return <div>no state</div>
  }
  const { appConfig } = appPageStore.state
  if (!appConfig) {
    return <div>no appConfig or appType</div>
  }
  return (
    <>
      <TitleBar draggable onDragStart={appFrameStore.onDragStart}>
        <WindowControls
          onClose={appPageStore.handleClose}
          onMax={appPageStore.isTorn ? appPageStore.handleMaximize : null}
          onMin={appPageStore.isTorn ? appPageStore.handleMinimize : null}
          itemProps={{
            size: 10,
          }}
        />
        <HorizontalSpace />
        <Icon
          onClick={appFrameStore.toggleSidebar}
          name="sidebar"
          color={appFrameStore.showSidebar ? '#3FB2FF' : '#666'}
          size={16}
          style={{ opacity: appFrameStore.showSidebar ? 1 : 0.5 }}
        />
        <CenteredTitle>
          <Text
            ellipse
            maxWidth="100%"
            selectable={false}
            size={0.95}
            fontWeight={500}
            alignItems="center"
          >
            {appConfig.title}
          </Text>
        </CenteredTitle>
      </TitleBar>
      <Row flex={1}>
        <Sidebar
          width={appFrameStore.showSidebar ? appFrameStore.sidebarWidth : 0}
          onResize={appFrameStore.setSidebarWidth}
          maxWidth={appFrameStore.size.width * 0.5}
          minWidth={200}
        >
          {appPageStore.isTorn && (
            <Searchable queryStore={queryStore}>
              <AppView
                id={appConfig.id}
                viewType="index"
                title={appConfig.title}
                type={appConfig.type}
                isActive
              />
            </Searchable>
          )}
        </Sidebar>
        <Col flex={1} overflow="hidden">
          <AppView
            id={appConfig.id}
            viewType={appConfig.viewType || 'main'}
            title={appConfig.title}
            type={appConfig.type}
            isActive
          />
        </Col>
      </Row>
    </>
  )
})

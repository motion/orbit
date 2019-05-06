import { gloss } from '@o/gloss'
import { AppView, Icon, QueryStore, SpaceStore } from '@o/kit'
import * as UI from '@o/ui'
import { Col, Row, SelectableStore, Sidebar, Space, Text } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { StoreContext } from '../../StoreContext'
import { useStores } from '../../hooks/useStores'
import { AppWrapper } from '../../views'
import { WindowControls } from '../../views/WindowControls'
import AppFrame from './AppFrame'
import { AppPageStore } from './AppPageStore'
import { AppSearchable } from './AppSearchable'

// see main.ts for setup for testing this in browser

export default React.memo(() => {
  const spaceStore = useStore(SpaceStore)
  const appPageStore = useStore(AppPageStore)
  const queryStore = useStore(QueryStore)
  const selectableStore = useStore(SelectableStore)

  return (
    <StoreContext.Provider
      value={{
        spaceStore,
        appPageStore,
        queryStore,
        selectableStore,
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

const AppPageContent = () => {
  const { appPageStore, appFrameStore } = useStores()
  if (!appPageStore.state) {
    return <div>no state</div>
  }
  const { appProps } = appPageStore.state
  if (!appProps) {
    return <div>no appProps or appType</div>
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
        <Space />
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
            {appProps.title}
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
            <AppSearchable>
              <AppView id={appProps.id} identifier={appProps.identifier} viewType="index" />
            </AppSearchable>
          )}
        </Sidebar>
        <Col flex={1} overflow="hidden">
          <AppView
            id={appProps.id}
            identifier={appProps.identifier}
            viewType={appProps.viewType || 'main'}
          />
        </Col>
      </Row>
    </>
  )
}

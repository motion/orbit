import * as React from 'react'
import { view, provide, attach } from '@mcro/black'
import { SourcesStore } from '../../stores/SourcesStore'
import { AppWrapper, HorizontalSpace } from '../../views'
import { AppPageStore } from './AppPageStore'
import * as UI from '@mcro/ui'
import { AppFrame, AppFrameStore } from './AppFrame'
import { WindowControls } from '../../views/WindowControls'
import { AppView } from '../../apps/AppView'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { Sidebar, Row, Text, Col } from '@mcro/ui'
import { Searchable } from '../../components/Searchable'
import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { SettingStore } from '../../stores/SettingStore'
import { SpaceStore } from '../../stores/SpaceStore'
import { Icon } from '../../views/Icon'
import { gloss } from '@mcro/gloss'

// see main.ts for setup for testing this in browser

type Props = {
  sourcesStore?: SourcesStore
  appPageStore?: AppPageStore
  queryStore?: QueryStore
}

@provide({
  sourcesStore: SourcesStore,
  settingStore: SettingStore,
  spaceStore: SpaceStore,
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
export default class AppPage extends React.Component<Props> {
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

const TitleBar = gloss({
  height: 32,
  alignItems: 'center',
  flexFlow: 'row',
  padding: [0, 8],
  position: 'relative',
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(0.5)],
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

@attach('queryStore', 'sourcesStore', 'appPageStore', 'appFrameStore')
@view
class AppPageContent extends React.Component<Props & { appFrameStore?: AppFrameStore }> {
  render() {
    const { appFrameStore, appPageStore, queryStore } = this.props
    if (!appPageStore.state) {
      return <div>no state</div>
    }
    const { appConfig, appType } = appPageStore.state
    if (!appConfig || !appType) {
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
            fill={appFrameStore.showSidebar ? '#3FB2FF' : '#666'}
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
                  type={appType}
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
              type={appType}
              isActive
            />
          </Col>
        </Row>
      </>
    )
  }
}

import * as React from 'react'
import { view, provide, attach } from '@mcro/black'
import { SourcesStore } from '../../stores/SourcesStore'
// import { MainShortcutHandler } from '../../components/shortcutHandlers/MainShortcutHandler'
import { AppWrapper } from '../../views'
import { AppPageStore } from './AppPageStore'
import * as UI from '@mcro/ui'
import { AppFrame } from './AppFrame'
import { WindowControls } from '../../views/WindowControls'
import { OrbitIntegration } from '../../sources/types'
import { AppView } from '../../apps/AppView'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { Sidebar, Row, Text, Col } from '@mcro/ui'

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

const TitleBar = view({
  height: 28,
  alignItems: 'center',
  flexFlow: 'row',
  padding: [0, 8],
}).theme(({ theme }) => ({
  borderBottom: [1, theme.borderColor.alpha(0.5)],
}))

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
    return (
      <>
        <TitleBar draggable onDragStart={appPageStore.onDragStart}>
          <WindowControls
            onClose={appPageStore.handleClose}
            onMax={appPageStore.isTorn ? appPageStore.handleMaximize : null}
            onMin={appPageStore.isTorn ? appPageStore.handleMinimize : null}
            itemProps={{
              size: 10,
            }}
          />
          <Text
            ellipse
            maxWidth="100%"
            selectable={false}
            size={0.85}
            fontWeight={600}
            alignItems="center"
          >
            {appConfig.title}
          </Text>
        </TitleBar>
        <Row flex={1}>
          {appPageStore.isTorn && (
            <Sidebar width={200}>
              <AppView
                id={appConfig.id}
                viewType="index"
                title={appConfig.title}
                type={appType}
                isActive
              />
            </Sidebar>
          )}
          <Col flex={1}>
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

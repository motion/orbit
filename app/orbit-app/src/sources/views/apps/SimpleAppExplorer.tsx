import { view, react, attach } from '@mcro/black'
import * as React from 'react'
import { Source } from '@mcro/models'
import { AppTopicExplorer } from './AppTopicExplorer'
import { SegmentedRow, View } from '@mcro/ui'
import { AppConfig } from '@mcro/stores'
import { TitleBarButton } from '../layout/TitleBarButton'
import { ScrollableContent } from '../layout/ScrollableContent'
import { HideablePane } from '../../../views/HideablePane'
import { getAppFromSource } from '../../../stores/SourcesStore'
import { AppHeader } from '../layout/AppHeader'

type Props = {
  appViewStore?: AppViewStore
  source: Source
  settingsPane: React.ReactNode
  initialState: AppConfig['viewConfig']['initialState']
}

const AppRelationsExplorer = () => {
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      Under Construction [hardhat.gif]
    </View>
  )
}

export class AppViewStore {
  props: Props

  active = 'topics'
  lastActive = 'topics'

  setter = key => () => {
    this.setActiveKey(key)
  }

  setActiveKey = key => {
    console.log('got active key', key)
    this.lastActive = this.active
    this.active = key
  }

  updateTab = react(() => (this.props.initialState || {}).active || 'topics', this.setActiveKey)

  activeToggler = key => () => {
    console.log('got toggle key', key)
    if (key === this.active) {
      this.setActiveKey(this.lastActive)
    } else {
      this.setActiveKey(key)
    }
  }
}

@attach({
  appViewStore: AppViewStore,
})
@view
export class SimpleAppExplorer extends React.Component<Props> {
  render() {
    const { source, settingsPane, appViewStore } = this.props
    const app = getAppFromSource(source)
    return (
      <>
        <AppHeader
          before={
            <>
              {app.appName} - {app.display.name}
            </>
          }
          after={
            <TitleBarButton
              tooltip="Settings"
              icon="gear"
              onClick={appViewStore.activeToggler('sources')}
              active={appViewStore.active === 'sources'}
            />
          }
        >
          <SegmentedRow>
            <TitleBarButton
              onClick={appViewStore.setter('topics')}
              active={appViewStore.active === 'topics'}
            >
              Topic Explorer
            </TitleBarButton>
            <TitleBarButton
              onClick={appViewStore.setter('related')}
              active={appViewStore.active === 'related'}
            >
              Relations Explorer
            </TitleBarButton>
          </SegmentedRow>
        </AppHeader>

        <ScrollableContent>
          <HideablePane invisible={appViewStore.active !== 'topics'}>
            <AppTopicExplorer source={source} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'related'}>
            <AppRelationsExplorer />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'sources'}>{settingsPane}</HideablePane>
        </ScrollableContent>
      </>
    )
  }
}

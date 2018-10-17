import { view, react } from '@mcro/black'
import * as React from 'react'
import { Setting } from '@mcro/models'
import { AppTopicExplorer } from './AppTopicExplorer'
import { SegmentedRow, View } from '@mcro/ui'
import { AppConfig } from '@mcro/stores'
import { TitleBarButton } from './TitleBarButton'
import { NICE_INTEGRATION_NAMES } from '../../constants'
import { ScrollableContent } from './ScrollableContent'
import { HideablePane } from './HideablePane'

type Props = {
  appViewStore?: AppViewStore
  setting: Setting
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

@view.attach({
  appViewStore: AppViewStore,
})
@view
export class SimpleAppExplorer extends React.Component<Props> {
  render() {
    const { setting, settingsPane, appViewStore } = this.props
    return (
      <>
        {NICE_INTEGRATION_NAMES[setting.type]}
        <TitleBarButton
          tooltip="Settings"
          icon="gear"
          onClick={appViewStore.activeToggler('settings')}
          active={appViewStore.active === 'settings'}
        />
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
        <ScrollableContent>
          <HideablePane invisible={appViewStore.active !== 'topics'}>
            <AppTopicExplorer setting={setting} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'related'}>
            <AppRelationsExplorer />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'settings'}>{settingsPane}</HideablePane>
        </ScrollableContent>
      </>
    )
  }
}

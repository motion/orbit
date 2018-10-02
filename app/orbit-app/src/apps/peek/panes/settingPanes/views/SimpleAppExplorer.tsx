import { view } from '@mcro/black'
import * as React from 'react'
import { Setting } from '@mcro/models'
import { PeekContent } from '../../../views/PeekContent'
import { HideablePane } from '../../../views/HideablePane'
import { AppTopicExplorer } from './AppTopicExplorer'
import { TitleBarButton } from '../../../views/TitleBarButton'
import { NICE_INTEGRATION_NAMES } from '../../../../../constants'
import { PeekHeader } from '../../../views/PeekHeader'
import { SegmentedRow, View } from '@mcro/ui'
import { AppConfig } from '@mcro/stores'

type Props = {
  appViewStore?: AppViewStore
  setting: Setting
  settingsPane: React.ReactNode
  initialState: AppConfig['config']['initialState']
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
  active = this.props.initialState.active || 'topics'
  lastActive = this.props.initialState.active || 'topics'

  setter = key => () => {
    this.setActiveKey(key)
  }

  setActiveKey = key => {
    this.lastActive = this.active
    this.active = key
  }

  activeToggler = key => () => {
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
        <PeekHeader
          before={NICE_INTEGRATION_NAMES[setting.type]}
          after={
            <TitleBarButton
              tooltip="Settings"
              icon="gear"
              onClick={appViewStore.activeToggler('settings')}
              active={appViewStore.active === 'settings'}
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
        </PeekHeader>
        <PeekContent>
          <HideablePane invisible={appViewStore.active !== 'topics'}>
            <AppTopicExplorer setting={setting} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'related'}>
            <AppRelationsExplorer />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'settings'}>{settingsPane}</HideablePane>
        </PeekContent>
      </>
    )
  }
}

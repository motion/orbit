import { view } from '@mcro/black'
import * as React from 'react'
import { Setting } from '@mcro/models'
import { PeekContent } from '../../../views/PeekContent'
import { HideablePane } from '../../../views/HideablePane'
import { AppTopicExplorer } from './AppTopicExplorer'
import { TitleBarButton } from '../../../views/TitleBarButton'
import { NICE_INTEGRATION_NAMES } from '../../../../../constants'
import { PeekHeader } from '../../../views/PeekHeader'
import { SegmentedRow } from '@mcro/ui'

type Props = {
  appViewStore?: AppViewStore
  setting: Setting
  settingsPane: React.ReactNode
}

export class AppViewStore {
  active = 'topics'
  lastActive = 'topics'

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
            <TitleBarButton>Topic Explorer</TitleBarButton>
            <TitleBarButton>Relations Explorer</TitleBarButton>
          </SegmentedRow>
        </PeekHeader>
        <PeekContent>
          <HideablePane invisible={appViewStore.active !== 'topics'}>
            <AppTopicExplorer setting={setting} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'related'}>{settingsPane}</HideablePane>
          <HideablePane invisible={appViewStore.active !== 'settings'}>{settingsPane}</HideablePane>
        </PeekContent>
      </>
    )
  }
}

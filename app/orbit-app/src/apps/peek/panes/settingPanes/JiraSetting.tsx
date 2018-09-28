import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { HideablePane } from '../../views/HideablePane'
import { AtlassianSetting } from '@mcro/models'
import { PeekSettingProps } from '../PeekSetting'
import { PeekSettingHeader } from './views/PeekSettingHeader'
import { PeekContent } from '../../views/PeekContent'
import { AppTopicExplorer } from './views/AppTopicExplorer'

type Props = PeekSettingProps<AtlassianSetting>

@view
export class JiraSetting extends React.Component<Props> {
  render() {
    const { appViewStore, setting } = this.props
    return (
      <>
        <PeekSettingHeader
          setting={setting}
          onClickSettings={appViewStore.activeToggler('settings')}
          settingsActive={appViewStore.active === 'settings'}
        />
        <PeekContent>
          <HideablePane invisible={appViewStore.active === 'settings'}>
            <AppTopicExplorer setting={setting} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'settings'}>
            <AtlassianSettingLogin type="confluence" setting={setting} />
          </HideablePane>
        </PeekContent>
      </>
    )
  }
}

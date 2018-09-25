import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { Tabs, Tab } from '@mcro/ui'
import { AtlassianSetting } from '@mcro/models'

class JiraSettingStore {
  active = 'status'
  setActiveKey = key => {
    this.active = key
  }
}

@view.attach({
  store: JiraSettingStore,
})
@view
export class JiraSetting extends React.Component<
  SettingPaneProps & { store: JiraSettingStore; setting: AtlassianSetting }
> {
  render() {
    const { store, setting, children } = this.props
    return children({
      belowHead: (
        <Tabs active={store.active} onActive={store.setActiveKey}>
          <Tab key="status" width="50%" label="Status" />
          <Tab key="repos" width="50%" label="Repos" />
        </Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'status'}>
            <AppStatusPane setting={setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'repos'}>
            <AtlassianSettingLogin type="jira" setting={setting} />
          </HideablePane>
        </>
      ),
    })
  }
}

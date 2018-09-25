import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { Tabs, Tab } from '@mcro/ui'

class ConfluenceSettingStore {
  active = 'status'
  setActiveKey = key => {
    this.active = key
  }
}

@view.attach({
  store: ConfluenceSettingStore,
})
@view
export class ConfluenceSetting extends React.Component<
  SettingPaneProps & { store: ConfluenceSettingStore }
> {
  render() {
    const { store, setting, children } = this.props
    return children({
      belowHead: (
        <Tabs active={store.active} onActive={store.setActiveKey}>
          <Tab key="status" width="50%" label="Status" />
          <Tab key="account" width="50%" label="Account" />
        </Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'status'}>
            <AppStatusPane setting={setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'account'}>
            <AtlassianSettingLogin type="confluence" setting={setting} />
          </HideablePane>
        </>
      ),
    })
  }
}

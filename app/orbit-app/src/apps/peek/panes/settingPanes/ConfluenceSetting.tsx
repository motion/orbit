import * as React from 'react'
import { view, compose } from '@mcro/black'
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

const decorator = compose(
  view.attach({
    store: ConfluenceSettingStore,
  }),
  view,
)

type Props = SettingPaneProps & { store: ConfluenceSettingStore }

export const ConfluenceSetting = decorator(
  ({ store, setting, children }: Props) => {
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
            <AtlassianSettingLogin type="confluence" setting={setting} />
          </HideablePane>
        </>
      ),
    })
  },
)

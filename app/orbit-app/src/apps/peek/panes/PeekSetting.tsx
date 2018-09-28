import { view } from '@mcro/black'
import { Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import { AppsStore } from '../../AppsStore'
import { AppInfoStore } from '../../../stores/AppInfoStore'
import { PeekPaneProps } from '../PeekPaneProps'
import * as SettingPanes from './settingPanes'

export type PeekSettingProps<T extends Setting> = PeekPaneProps<T> & {
  store?: AppInfoStore
  appsStore?: AppsStore
  appViewStore?: AppViewStore
  setting?: T
}

const EmptyPane = ({ setting }) => <div>no setting {JSON.stringify(setting)} pane</div>

class AppViewStore {
  active = 'main'
  lastActive = 'main'

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

@view.attach('appsStore')
@view.attach({
  store: AppInfoStore,
  appViewStore: AppViewStore,
})
@view
export class PeekSetting extends React.Component<PeekSettingProps<Setting>> {
  render() {
    const { model, store, peekStore, appsStore, appViewStore, ...props } = this.props
    if (!model) {
      return null
    }
    const integration = model.type
    const SettingPane = SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return (
      <SettingPane
        appsStore={appsStore}
        setting={model}
        appInfoStore={store}
        peekStore={peekStore}
        appViewStore={appViewStore}
        {...props}
      />
    )
  }
}

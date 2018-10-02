import { view } from '@mcro/black'
import { Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import { AppsStore } from '../../AppsStore'
import { AppInfoStore } from '../../../stores/AppInfoStore'
import { PeekPaneProps } from '../PeekPaneProps'
import * as SettingPanes from './settingPanes'
import { AppConfig, App } from '@mcro/stores'

export type PeekSettingProps<T extends Setting> = PeekPaneProps<T> & {
  appInfoStore?: AppInfoStore
  appsStore?: AppsStore
  setting?: T
  initialState?: AppConfig['config']['initialState']
}

const EmptyPane = ({ setting }) => <div>no setting {JSON.stringify(setting)} pane</div>

//
// 🚨 not a reactive view 🚨
//

@view.attach('appsStore')
@view.provide({
  appInfoStore: AppInfoStore,
})
export class PeekSetting extends React.Component<PeekSettingProps<Setting>> {
  render() {
    const { model, appInfoStore, appConfig, peekStore, appsStore, ...props } = this.props
    if (!model || !App.peekState.appConfig) {
      return null
    }
    const integration = model.type
    const SettingPane = SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return (
      <SettingPane
        appsStore={appsStore}
        setting={model}
        appInfoStore={appInfoStore}
        peekStore={peekStore}
        appConfig={appConfig}
        initialState={appConfig.config.initialState}
        {...props}
      />
    )
  }
}

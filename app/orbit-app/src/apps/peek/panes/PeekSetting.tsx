import { view } from '@mcro/black'
import { Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import { AppsStore } from '../../AppsStore'
import { AppInfoStore } from '../../../stores/AppInfoStore'
import { PeekPaneProps } from '../PeekPaneProps'
import * as SettingPanes from './settingPanes'

export type PeekSettingProps<T extends Setting> = PeekPaneProps<T> & {
  appInfoStore?: AppInfoStore
  appsStore?: AppsStore
  setting?: T
}

const EmptyPane = ({ setting }) => <div>no setting {JSON.stringify(setting)} pane</div>

@view.attach('appsStore')
@view.provide({
  appInfoStore: AppInfoStore,
})
@view
export class PeekSetting extends React.Component<PeekSettingProps<Setting>> {
  render() {
    const { model, appInfoStore, peekStore, appsStore, ...props } = this.props
    if (!model) {
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
        {...props}
      />
    )
  }
}

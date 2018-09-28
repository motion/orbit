import { view } from '@mcro/black'
import { Setting } from '@mcro/models'
import { capitalize } from 'lodash'
import * as React from 'react'
import { AppsStore } from '../../AppsStore'
import { AppInfoStore } from '../../../stores/AppInfoStore'
import { PeekPaneProps } from '../PeekPaneProps'
import * as SettingPanes from './settingPanes'

type Props = PeekPaneProps & {
  store?: AppInfoStore
  appsStore?: AppsStore
  setting: Setting
}

const EmptyPane = ({ setting }) => <div>no setting {JSON.stringify(setting)} pane</div>

@view.attach('appsStore')
@view.attach({
  store: AppInfoStore,
})
@view
class SettingContent extends React.Component<Props> {
  render() {
    const { appsStore, setting, store } = this.props
    const integration = setting.type
    const SettingPane = SettingPanes[`${capitalize(integration)}Setting`] || EmptyPane
    return <SettingPane appsStore={appsStore} setting={setting} appInfoStore={store} />
  }
}

@view
export class PeekSetting extends React.Component<PeekPaneProps<Setting>> {
  render() {
    const { peekStore, ...props } = this.props
    const { model } = peekStore.state
    if (!model) {
      return null
    }
    return <SettingContent setting={model} peekStore={peekStore} {...props} />
  }
}

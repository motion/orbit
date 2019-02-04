import { AppType } from '@mcro/models'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppProps } from '../AppProps'
import SettingsAppAccount from './SettingsAppAccount'
import { SettingsAppGeneral } from './SettingsAppGeneral'

export default observer(function SettingsAppMain(props: AppProps<AppType.settings>) {
  if (!props.appConfig) {
    return null
  }

  switch (props.appConfig.subType) {
    case 'general':
      return <SettingsAppGeneral {...props} />
    case 'account':
      return <SettingsAppAccount {...props} />
    default:
      return <div>no found pane in settings {JSON.stringify(props.appConfig)}</div>
  }
})

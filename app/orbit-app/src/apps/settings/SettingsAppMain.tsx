import * as React from 'react'
import { AppProps } from '../AppTypes'
import SettingsAppAccount from './SettingsAppAccount'
import { SettingsAppGeneral } from './SettingsAppGeneral'

export default function SettingsAppMain(props: AppProps) {
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
}

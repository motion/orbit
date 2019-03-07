import { AppProps } from '@o/kit'
import * as React from 'react'
import SettingsAppAccount from './SettingsAppAccount'
import { SettingsAppGeneral } from './SettingsAppGeneral'

export function SettingsAppMain(props: AppProps) {
  if (!props.appConfig) {
    return null
  }

  switch (props.appConfig.id) {
    case 'general':
      return <SettingsAppGeneral {...props} />
    case 'account':
      return <SettingsAppAccount {...props} />
    default:
      return <div>no found pane in settings {JSON.stringify(props.appConfig)}</div>
  }
}

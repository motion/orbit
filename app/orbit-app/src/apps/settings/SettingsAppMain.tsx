import { AppViewProps } from '@o/kit'
import * as React from 'react'
import SettingsAppAccount from './SettingsAppAccount'
import { SettingsAppGeneral } from './SettingsAppGeneral'

export function SettingsAppMain(props: AppViewProps) {
  switch (props.id) {
    case 'general':
      return <SettingsAppGeneral {...props} />
    case 'account':
      return <SettingsAppAccount />
    default:
      return <div>no found pane in settings {JSON.stringify(props)}</div>
  }
}

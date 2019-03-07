import { AppMainProps, AppView } from '@o/kit'
import * as React from 'react'
import { ManageApps } from './ManageApps'

export function AppsMainSetup(props: AppMainProps) {
  if (props.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.viewType === 'setup') {
    return <AppView identifier={props.identifier} viewType="setup" {...props} />
  }

  if (props.viewType === 'settings') {
    return <AppView identifier={props.identifier} viewType="settings" {...props} />
  }
}

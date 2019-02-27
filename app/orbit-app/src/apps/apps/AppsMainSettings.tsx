import { AppView } from '@mcro/kit'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { ManageApps } from './ManageApps'

export function AppsMainSetup(props: AppProps) {
  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.viewType === 'setup') {
    return <AppView identifier={props.appConfig.identifier} viewType="setup" {...props} />
  }

  if (props.appConfig.viewType === 'settings') {
    return <AppView identifier={props.appConfig.identifier} viewType="settings" {...props} />
  }
}

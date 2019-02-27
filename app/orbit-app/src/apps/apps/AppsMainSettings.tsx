import { useModel } from '@mcro/bridge'
import { AppView, useAppView } from '@mcro/kit'
import { AppModel } from '@mcro/models'
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

  // if (props.appConfig.appId === 'apps') {
  //   console.log('loading app settings view', props)
  //   return <AppsMainSettings appId={props.appConfig.subId} />
  // }
}

export function AppsMainSettings(props: { appId: string }) {
  const [app] = useModel(AppModel, { where: { id: +props.appId } })
  const View = useAppView(props.appId, 'settings')
  if (!app) {
    // !todo suspense style loading
    return null
  }
  return <View app={app} />
}

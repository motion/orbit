import { useModel } from '@mcro/bridge'
import { AppSubView, AppView } from '@mcro/kit'
import { SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppTypes'
import { ManageApps } from './ManageApps'

export function SourcesAppMain(props: AppProps) {
  console.log('rendering me', props)

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.viewType === 'setup') {
    return <AppView appId={props.appConfig.appId} viewType="setup" {...props} />
  }

  if (props.appConfig.appId === 'sources') {
    return <SourceMain {...props} />
  }

  return <AppSubView appConfig={props.appConfig} />
}

function SourceMain(props: AppProps) {
  const [source] = useModel(SourceModel, {
    where: { id: +props.appConfig.subId },
  })

  if (!source) {
    return null
  }

  // !TODO
  return <AppView appId={props.appConfig.appId} viewType="settings" appConfig={props.appConfig} />
}

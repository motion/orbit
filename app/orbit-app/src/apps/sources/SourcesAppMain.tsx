import { useModel } from '@mcro/bridge'
import { AppSubView, AppView } from '@mcro/kit'
import { SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppTypes'
import { ManageApps } from './ManageApps'

export function SourcesAppMain(props: AppProps) {
  if (!props.appConfig) {
    return null
  }

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.viewType === 'setup') {
    const type = props.appConfig.source
    console.log('getting view', type)
    return <AppView viewType="setup" {...props} />
  }

  if (props.appConfig.appId === 'sources') {
    return <SourceMain {...props} />
  }

  return <AppSubView appConfig={props.appConfig} />
}

function SourceMain(props: AppProps) {
  const [source] = useModel(SourceModel, {
    where: { id: +props.appConfig.id },
  })

  if (!source) {
    return null
  }

  // !TODO
  return <AppView viewType="settings" appConfig={props.appConfig} />
}

import { useModel } from '@mcro/bridge'
import { AppSubView, AppView, useAppView } from '@mcro/kit'
import { SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppTypes'
import { ManageApps } from './ManageApps'

export function SourcesAppMain(props: AppProps) {
  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.viewType === 'setup') {
    return <AppView appId={props.appConfig.appId} viewType="setup" {...props} />
  }

  if (props.appConfig.appId === 'sources') {
    console.log('loading source settings view', props)
    return <SourcesMainSettings appId={props.appConfig.subType} sourceId={props.appConfig.subId} />
  }

  return <AppSubView appConfig={props.appConfig} />
}

function SourcesMainSettings(props: { sourceId: string; appId: string }) {
  const [source] = useModel(SourceModel, { where: { id: +props.sourceId } })
  const View = useAppView(props.appId, 'settings')
  if (!source) {
    // !todo suspense style loading
    return null
  }
  return <View source={source} />
}

import { SourceModel } from '@mcro/models'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'
import { useModel } from '../../useModel'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'
import { ManageApps } from './ManageApps'

export function SourcesAppMain(props: AppProps) {
  const { sourcesStore } = useStores()

  if (!props.appConfig) {
    return null
  }

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.viewType === 'setup') {
    const type = props.appConfig.integration
    const View = sourcesStore.getView(type, 'setup')
    console.log('getting view', type, View)
    return <View {...props} />
  }

  if (props.appConfig.type === 'sources') {
    return <SourceMain {...props} />
  }

  return <AppSubView appConfig={props.appConfig} />
}

function SourceMain(props: AppProps) {
  const { sourcesStore } = useStores()
  const [source] = useModel(SourceModel, {
    where: { id: +props.appConfig.id },
  })

  if (!source) {
    return null
  }

  const type = props.appConfig.integration
  const View = sourcesStore.getView(type, 'setting')

  if (!View) {
    console.log(props.appConfig)
    return (
      <div>
        no view type {type}, for source <br />
      </div>
    )
  }

  return <View source={source} appConfig={props.appConfig} />
}

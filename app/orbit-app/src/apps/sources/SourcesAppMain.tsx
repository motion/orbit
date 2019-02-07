import { useModel } from '@mcro/model-bridge'
import { AppType, IntegrationType, SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { AppSubView } from '../views/AppSubView'
import { ManageApps } from './ManageApps'

export function SourcesAppMain(props: AppProps<any>) {
  if (!props.appConfig) {
    return null
  }

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.type === 'sources') {
    return <SourceMain {...props} />
  }

  return <AppSubView appConfig={props.appConfig} />
}

function SourceMain(props: AppProps<AppType.sources>) {
  const [source] = useModel(
    SourceModel,
    props.appConfig.viewType !== 'setup' && {
      where: { id: +props.appConfig.id },
    },
  )

  if (!source) {
    return null
  }

  const type = props.appConfig.integration as IntegrationType
  const View = props.sourcesStore.getView(type, 'setting')

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

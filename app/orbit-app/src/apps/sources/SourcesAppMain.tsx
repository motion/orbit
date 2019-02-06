import { useModel } from '@mcro/model-bridge'
import { IntegrationType, SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { ManageApps } from './ManageApps'

export const SourcesAppMain = (props: AppProps<any>) => {
  if (!props.appConfig) {
    return null
  }

  const [source] = useModel(
    SourceModel,
    props.appConfig.viewType !== 'setup' && {
      where: { id: +props.appConfig.id },
    },
  )

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

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

import * as React from 'react'
import { AppProps } from '../AppProps'
import { SourceModel, IntegrationType } from '@mcro/models'
import { useObserveOne } from '@mcro/model-bridge'

export const SourcesAppMain = (props: AppProps<any>) => {
  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  const source = useObserveOne(
    SourceModel,
    props.appConfig.viewType !== 'setup' && {
      where: { id: +props.appConfig.id },
    },
  )
  const type = props.appConfig.integration as IntegrationType
  const View = props.sourcesStore.getView(type, 'setting')

  if (!View) {
    return (
      <div>
        no view type {type}, for source <br />
        appConfig: <pre>{JSON.stringify(props.appConfig, null, 2)}</pre>
      </div>
    )
  }

  return <View source={source} appConfig={props.appConfig} />
}

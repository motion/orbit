import { useObserveOne } from '@mcro/model-bridge'
import { AppType, IntegrationType, SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { AppView } from '../AppView'

export const SourcesAppMain = (props: AppProps<any>) => {
  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  console.log('showing', props.appConfig)
  if (props.appConfig.type !== AppType.sources) {
    return <AppView viewType="main" {...props.appConfig} id={+props.appConfig.id} />
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

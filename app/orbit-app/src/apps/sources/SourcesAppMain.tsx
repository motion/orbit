import * as React from 'react'
import { AppProps } from '../AppProps'
import { SourceModel } from '@mcro/models'
import { useObserveOne } from '@mcro/model-bridge'

export const SourcesAppMain = (props: AppProps<any>) => {
  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  const source = useObserveOne(SourceModel, {
    where: { id: +props.appConfig.id },
  })
  const type = source ? source.type : props.sourceType
  const View = props.sourcesStore.getView(type, 'setting')

  if (!View) {
    return (
      <div>
        no view type {type}, for source <br />
        appConfig: <pre>{JSON.stringify(props.appConfig, 0, 2)}</pre>
      </div>
    )
  }
  if (!source) {
    return <div> no source model</div>
  }

  return <View source={source} appConfig={props.appConfig} />
}

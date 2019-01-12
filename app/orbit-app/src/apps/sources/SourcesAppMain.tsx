import * as React from 'react'
import { AppProps } from '../AppProps'
import { SourceModel } from '@mcro/models'
import { useObserveOne } from '@mcro/model-bridge/_/useModel'
import { AppInfoStore } from '../../components/AppInfoStore'
import { useStore } from '@mcro/use-store'

export const SourcesAppMain = (props: AppProps<any>) => {
  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  const appInfoStore = useStore(AppInfoStore)
  const source = useObserveOne(SourceModel, {
    where: { id: +props.appConfig.id },
  })
  const type = source ? source.type : props.sourceType
  const View = props.sourcesStore.getView(type, 'setting')

  if (!View) {
    return (
      <div>
        no view type {type}, for source {JSON.stringify(source)}
      </div>
    )
  }
  if (!source) {
    return <div> no source model</div>
  }

  return <View appInfoStore={appInfoStore} source={source} appConfig={props.appConfig} />
}

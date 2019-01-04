import * as React from 'react'
import { AppProps } from '../AppProps'
import { SourceModel } from '@mcro/models'
import { AttachAppInfoStore } from '../../components/AttachAppInfoStore'
import { useObserveOne } from '@mcro/model-bridge/_/useModel'

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
    return <div>no view {type}</div>
  }
  if (!source) {
    return <div> no source model</div>
  }

  return (
    <AttachAppInfoStore>
      {appInfoStore => (
        <View appInfoStore={appInfoStore} source={source} appConfig={props.appStore.appConfig} />
      )}
    </AttachAppInfoStore>
  )
}

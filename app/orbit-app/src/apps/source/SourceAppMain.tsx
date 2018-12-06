import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { SourceModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { AttachAppInfoStore } from '../../components/AttachAppInfoStore'
import { observer } from 'mobx-react-lite'

class SourceAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  model = react(
    () => this.appConfig,
    ({ id }) => {
      console.log('loading model', id)
      return loadOne(SourceModel, {
        args: {
          where: { id },
        },
      })
    },
  )
}

export const SourceAppMain = observer((props: AppProps) => {
  const { model } = useStore(SourceAppStore, props)
  const type = model ? model.type : props.sourceType
  const View = props.sourcesStore.getView(type, 'setting')
  if (!View) {
    return <div>nonno {type}</div>
  }
  if (!model) {
    return null
  }
  return (
    <AttachAppInfoStore>
      {appInfoStore => (
        <View appInfoStore={appInfoStore} source={model} appConfig={props.appStore.appConfig} />
      )}
    </AttachAppInfoStore>
  )
})

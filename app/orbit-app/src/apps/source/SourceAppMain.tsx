import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { SourceModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { AttachAppInfoStore } from '../../components/AttachAppInfoStore'

class SourceAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  model = react(
    () => this.appConfig,
    ({ id }) =>
      loadOne(SourceModel, {
        args: {
          where: { id },
        },
      }),
  )
}

export function SourceAppMain(props: AppProps) {
  const { model } = useStore(SourceAppStore, props)
  const type = model ? model.type : props.sourceType
  const View = props.sourcesStore.getView(type, 'setup')

  return (
    <AttachAppInfoStore>{appInfoStore => <View appInfoStore={appInfoStore} />}</AttachAppInfoStore>
  )
}

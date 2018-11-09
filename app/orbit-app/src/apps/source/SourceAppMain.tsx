import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { SourceModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'

class SourceAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  getModel = async id => {
    return await loadOne(SourceModel, {
      args: {
        where: { id },
      },
    })
  }
}

export function SourceAppMain(props: AppProps) {
  const store = useStore(SourceAppStore, props)
  return (
    <>
      hi {JSON.stringify(props)} {JSON.stringify(store.appConfig)}
    </>
  )
}

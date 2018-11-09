import * as React from 'react'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { AppView } from '../AppView'

class SearchAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  get appType() {
    return this.props.appStore.appType
  }
}

export function SearchAppMain(props: AppProps) {
  const { appConfig, appType } = useStore(SearchAppStore, props)

  // show a single item
  if (appType === 'bit' || appType === 'people') {
    return <AppView view="main" id={appConfig.id} title={appConfig.title} type={appType} />
  }

  // show a search

  return <>hi {JSON.stringify(props)}</>
}

import * as React from 'react'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { AppView } from '../AppView'

class SearchAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }
}

export function SearchAppMain(props: AppProps) {
  const { appConfig } = useStore(SearchAppStore, props)

  // show a single item
  if (appConfig.type === 'bit' || appConfig.type === 'person') {
    return (
      <AppView
        view="main"
        id={appConfig.id}
        title={appConfig.title}
        type={appConfig.type === 'bit' ? 'bit' : 'people'}
      />
    )
  }

  // show a search

  return <>hi {JSON.stringify(props)}</>
}

import * as React from 'react'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { AppView } from '../AppView'
import { SearchAppIndex } from './SearchAppIndex'
import { observer } from 'mobx-react-lite'
import { AppType } from '@mcro/models'

class SearchAppStore {
  props: AppProps<AppType.search>

  get appConfig() {
    return this.props.appStore.appConfig
  }
}

export const SearchAppMain = observer((props: AppProps<AppType.search>) => {
  const { appConfig } = useStore(SearchAppStore, props)

  if (!appConfig) {
    return null
  }

  // show a single item
  if (appConfig.type === 'bit' || appConfig.type === 'people') {
    return (
      <AppView viewType="main" id={appConfig.id} title={appConfig.title} type={appConfig.type} />
    )
  }

  // show a search

  return (
    <>
      <SearchAppIndex {...props} />
    </>
  )
})

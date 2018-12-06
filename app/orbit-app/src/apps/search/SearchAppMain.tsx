import * as React from 'react'
import { AppProps } from '../AppProps'
import { useStore } from '@mcro/use-store'
import { AppView } from '../AppView'
import { SearchAppIndex } from './SearchAppIndex'
import { observer } from 'mobx-react-lite'

class SearchAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }
}

export const SearchAppMain = observer((props: AppProps) => {
  const { appConfig } = useStore(SearchAppStore, props)

  if (!appConfig) {
    return null
  }

  // show a single item
  if (appConfig.type === 'bit' || appConfig.type === 'person') {
    return (
      <AppView
        viewType="main"
        id={appConfig.id}
        title={appConfig.title}
        type={appConfig.type === 'bit' ? 'bit' : 'people'}
      />
    )
  }

  // show a search

  return (
    <>
      <SearchAppIndex {...props} />
    </>
  )
})

import * as React from 'react'
import { AppProps } from '../AppProps'
import AppView from '../AppView'
import SearchAppIndex from './SearchAppIndex'
import { observer } from 'mobx-react-lite'
import { AppType } from '@mcro/models'

export default observer(function SearchAppMain(props: AppProps<AppType.search>) {
  const appConfig = props.appConfig

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

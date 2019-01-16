import * as React from 'react'
import { AppProps } from '../AppProps'
import AppView from '../AppView'
import SearchAppIndex from './SearchAppIndex'
import { AppType } from '@mcro/models'
import { Message } from '../../views/Message'

export default function SearchAppMain(props: AppProps<AppType.search>) {
  const appConfig = props.appConfig

  if (!appConfig || !appConfig.id) {
    return <Message>Nothing selected</Message>
  }

  // show a single item
  if (appConfig.type === 'bit' || appConfig.type === 'people') {
    return (
      <AppView
        viewType="main"
        id={+appConfig.id}
        title={appConfig.title}
        type={appConfig.type}
        appConfig={appConfig}
      />
    )
  }

  // show a search
  return <SearchAppIndex {...props} />
}

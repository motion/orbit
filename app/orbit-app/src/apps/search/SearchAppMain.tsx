import { AppType } from '@mcro/models'
import * as React from 'react'
import { Message } from '../../views/Message'
import { AppProps } from '../AppProps'
import { AppView } from '../AppView'
import SearchAppIndex from './SearchAppIndex'

export default function SearchAppMain(props: AppProps<AppType.search>) {
  const appConfig = props.appConfig

  if (!appConfig) {
    return <Message>Nothing selected {JSON.stringify(appConfig || null)}</Message>
  }

  if (appConfig.type === 'search') {
    return <SearchAppIndex {...props} />
  }

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

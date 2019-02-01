import { AppType } from '@mcro/models'
import * as React from 'react'
import { Message } from '../../views/Message'
import { AppProps } from '../AppProps'
import { AppSubView } from '../views/AppSubView'

export default function SearchAppMain(props: AppProps<AppType.search>) {
  const appConfig = props.appConfig

  if (!appConfig) {
    return <Message>Nothing selected {JSON.stringify(appConfig || null)}</Message>
  }

  if (appConfig.type === 'search') {
    return <div>todo: search</div>
  }

  return <AppSubView appConfig={appConfig} />
}

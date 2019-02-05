import { AppType } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { AppSubView } from '../views/AppSubView'

export default function SearchAppMain({ appConfig }: AppProps<AppType.search>) {
  if (appConfig.type === 'search') {
    return <div>todo: search</div>
  }

  return <AppSubView appConfig={appConfig} />
}

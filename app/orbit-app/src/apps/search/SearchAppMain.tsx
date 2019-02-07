import * as React from 'react'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'

export default function SearchAppMain({ appConfig }: AppProps) {
  console.log('rendering mina', appConfig)

  if (appConfig.type === 'search') {
    return <div>todo: search</div>
  }

  return <AppSubView appConfig={appConfig} />
}

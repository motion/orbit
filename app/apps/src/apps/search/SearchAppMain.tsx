import { AppProps, AppSubView } from '@mcro/kit'
import * as React from 'react'

export function SearchAppMain({ appConfig }: AppProps) {
  if (appConfig.appId === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

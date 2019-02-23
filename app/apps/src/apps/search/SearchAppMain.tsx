import { AppProps, AppSubView } from '@mcro/kit'
import * as React from 'react'

export function SearchAppMain({ appConfig }: AppProps) {
  console.log('wut', appConfig)

  if (appConfig.id === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

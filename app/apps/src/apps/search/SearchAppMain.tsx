import { AppProps, AppSubView } from '@mcro/kit'
import * as React from 'react'

export default function SearchAppMain({ appConfig }: AppProps) {
  if (appConfig.type === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

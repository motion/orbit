import { AppProps, AppSubView } from '@o/kit'
import React from 'react'
import { SearchHome } from './SearchHome'

export function SearchAppMain({ appConfig }: AppProps) {
  if (appConfig.identifier === 'apps') {
    return <SearchHome />
  }

  if (appConfig.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

import { AppMainView, AppProps } from '@o/kit'
import React from 'react'
import { SearchHome } from './SearchHome'

export function SearchAppMain(props: AppProps) {
  if (props.identifier === 'apps') {
    return <SearchHome />
  }

  if (props.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppMainView {...props} />
}

import { AppMainProps, AppMainView } from '@o/kit'
import React from 'react'
import { SearchHome } from './SearchHome'

export function SearchAppMain(props: AppMainProps) {
  if (props.identifier === 'apps') {
    return <SearchHome />
  }

  if (props.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppMainView {...props} />
}

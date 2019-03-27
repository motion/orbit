import { AppMainView, AppProps } from '@o/kit'
import React from 'react'
import { ManageApps } from './ManageApps'

export function SearchAppMain(props: AppProps) {
  if (props.subType === 'home') {
    return <ManageApps />
  }

  if (props.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppMainView {...props} />
}

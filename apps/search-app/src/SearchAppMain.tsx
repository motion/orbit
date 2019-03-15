import { AppMainView, AppProps } from '@o/kit'
import React from 'react'

export function SearchAppMain(props: AppProps) {
  if (props.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppMainView {...props} />
}

import { Loading } from '@o/ui'
import React from 'react'
import { AppProps } from '../types/AppProps'
import { AppView } from './AppView'

export function AppMainView(props: AppProps) {
  if (!props.identifier) {
    return <Loading />
  }
  return (
    <AppView
      key={JSON.stringify(props)}
      id={props.id}
      identifier={props.identifier}
      viewType={props.viewType || 'main'}
      appProps={props}
    />
  )
}

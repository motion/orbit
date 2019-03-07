import React from 'react'
import { AppProps } from '../types/AppProps'
import { AppView } from './AppView'

export function AppMainView(props: AppProps) {
  if (!props.identifier) {
    console.debug('no app id given', props)
    return null
  }
  console.log('wut', props)
  return (
    <AppView
      key={JSON.stringify(props)}
      id={props.id}
      identifier={props.identifier}
      viewType="main"
      appProps={props}
    />
  )
}

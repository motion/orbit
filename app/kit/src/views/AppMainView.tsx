import React from 'react'
import { AppMainProps } from '../types/AppMainProps'
import { AppView } from './AppView'

export function AppMainView(props: AppMainProps) {
  if (!props.identifier) {
    console.debug('no app id given', props)
    return null
  }
  return (
    <AppView
      key={JSON.stringify(props)}
      id={props.id}
      identifier={props.identifier}
      viewType="main"
      appConfig={props}
    />
  )
}

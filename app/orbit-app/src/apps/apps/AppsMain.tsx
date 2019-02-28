import { AppSubView } from '@mcro/kit'
import React from 'react'
import { AppProps } from '../AppProps'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  if (props.appConfig.identifier !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.appConfig.subId} />
  }

  return null
}

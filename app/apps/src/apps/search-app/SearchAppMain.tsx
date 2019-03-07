import { AppProps, AppSubView } from '@mcro/kit'
import { Title } from '@mcro/ui'
import React from 'react'

export function SearchAppMain({ appConfig }: AppProps) {
  return <Title>ok {JSON.stringify(appConfig)}</Title>

  if (appConfig.identifier === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

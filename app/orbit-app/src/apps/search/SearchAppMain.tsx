import * as React from 'react'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'

export default function SearchAppMain({ appConfig }: AppProps) {
  if (appConfig.type === 'search') {
    console.warn('todo: search')
    return null
  }

  return <AppSubView appConfig={appConfig} />
}

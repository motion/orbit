import { Text } from '@mcro/ui'
import * as React from 'react'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'

export default function SearchAppMain({ appConfig }: AppProps) {
  if (appConfig.type === 'search') {
    return <Text>todo: search</Text>
  }

  return <AppSubView appConfig={appConfig} />
}

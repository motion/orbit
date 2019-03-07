import { AppProps, AppSubView } from '@mcro/kit'
import { Title } from '@mcro/ui'
import React from 'react'
import { stringify } from '../../helpers'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  return <Title>hi {stringify(props.appConfig)}</Title>

  if (props.appConfig.identifier !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.appConfig.subId} />
  }

  return <Title>hi</Title>
}

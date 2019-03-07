import { AppMainView, AppProps } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'
import { stringify } from '../../helpers'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  return <Title>hi {stringify(props)}</Title>

  if (props.identifier !== 'apps') {
    return <AppMainView {...props} />
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <Title>hi</Title>
}

import { AppMainView, AppProps } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  console.log('props213', props)

  if (props.identifier !== 'apps') {
    return <AppMainView {...props} />
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <Title>hi</Title>
}

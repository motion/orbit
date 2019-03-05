import { AppProps, AppSubView } from '@mcro/kit'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainManage } from './AppsMainManage'

export function AppsMain(props: AppProps) {
  if (props.appConfig.identifier !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.appConfig.subId} />
  }

  return <AppsMainManage />
}

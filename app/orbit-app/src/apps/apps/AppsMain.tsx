import { AppSubView } from '@mcro/kit'
import React from 'react'
import { AppProps } from '../AppProps'
import { AppsMainManage } from './AppsMainManage'
import { AppsMainNew } from './AppsMainNew'

export function AppsMain(props: AppProps) {
  console.log('wut', props.appConfig)

  if (!props.appConfig) {
    return <AppsMainManage />
  }

  if (props.appConfig.identifier !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'new') {
    return <AppsMainNew />
  }

  return <AppsMainManage />
}

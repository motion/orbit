import { AppSubView } from '@mcro/kit'
import React from 'react'
import { AppProps } from '../AppProps'
import { AppsMainManage } from './AppsMainManage'

export function AppsMain(props: AppProps) {
  if (props.appConfig.identifier !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'new') {
    console.log('render new')
    // return <AppsMainNew />
  }

  if (props.appConfig.subType === 'settings') {
    console.log('render app', props.appConfig)
    return null
  }

  return <AppsMainManage />
}

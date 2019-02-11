import React from 'react'
import { AppProps } from '../AppTypes'
import AppsMainManage from './AppsMainManage'
import AppsMainNew from './AppsMainNew'

export default function AppsAppsMain(props: AppProps) {
  if (!props.appConfig) {
    return <AppsMainManage />
  }

  if (props.appConfig.subType === 'new') {
    return <AppsMainNew />
  }

  return <AppsMainManage />
}

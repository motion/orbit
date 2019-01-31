import { AppType } from '@mcro/models'
import React from 'react'
import { AppProps } from '../AppProps'
import AppsMainManage from './AppsMainManage'
import AppsMainNew from './AppsMainNew'

export default function AppsAppsMain(props: AppProps<AppType.apps>) {
  if (!props.appConfig || props.appConfig.subType === 'new') {
    return <AppsMainNew />
  }

  return <AppsMainManage />
}

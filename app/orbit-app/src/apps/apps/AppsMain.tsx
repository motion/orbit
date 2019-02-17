import React from 'react'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'
import AppsMainManage from './AppsMainManage'
import AppsMainNew from './AppsMainNew'

export default function AppsAppsMain(props: AppProps) {
  if (!props.appConfig) {
    return <AppsMainManage />
  }

  if (props.appConfig.type === 'sources') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'new') {
    return <AppsMainNew />
  }

  return (
    <>
      <AppsMainManage />
    </>
  )
}

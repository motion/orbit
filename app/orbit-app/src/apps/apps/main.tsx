import { App, AppDefinition, AppSubView } from '@mcro/kit'
import React from 'react'
import { AppProps } from '../AppTypes'
import AppsAppsIndex from './AppsIndex'
import AppsMainManage from './AppsMainManage'
import AppsMainNew from './AppsMainNew'

function AppsMain(props: AppProps) {
  if (!props.appConfig) {
    return <AppsMainManage />
  }

  if (props.appConfig.type !== 'apps') {
    return <AppSubView appConfig={props.appConfig} />
  }

  if (props.appConfig.subType === 'new') {
    return <AppsMainNew />
  }

  return <AppsMainManage />
}

export const id = 'apps'

export const app: AppDefinition = {
  name: 'Apps',
  icon: '',
  app: props => (
    <App index={<AppsAppsIndex {...props} />}>
      <AppsMain {...props} />
    </App>
  ),
}

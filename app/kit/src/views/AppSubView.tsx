import React from 'react'
import { AppView, AppViewProps } from './AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  if (!appConfig.appId) {
    console.warn('no app id given')
    return null
  }

  return (
    <AppView
      key={JSON.stringify(appConfig)}
      id={appConfig.id}
      appId={appConfig.appId}
      viewType={appConfig.viewType || viewType}
      appConfig={appConfig}
    />
  )
}

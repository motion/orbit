import React from 'react'
import { AppView, AppViewProps } from './AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  console.log('subview', JSON.stringify(appConfig))
  return (
    <AppView
      key={JSON.stringify(appConfig)}
      id={appConfig.id}
      appId={appConfig.appId}
      viewType={viewType}
      appConfig={appConfig}
    />
  )
}

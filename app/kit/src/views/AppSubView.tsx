import React from 'react'
import { AppView, AppViewProps } from './AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  return (
    <AppView
      key={JSON.stringify(appConfig)}
      id={appConfig.id}
      appId={appConfig.appId}
      viewType={viewType}
      appConfig={appConfig}
      {...{ ['debug']: true }}
    />
  )
}

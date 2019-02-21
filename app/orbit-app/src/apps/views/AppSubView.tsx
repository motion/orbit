import React from 'react'
import { AppView, AppViewProps } from '../AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  return (
    <AppView
      key={JSON.stringify(appConfig)}
      viewType={viewType}
      title={appConfig.title}
      type={appConfig.type}
      appConfig={appConfig}
    />
  )
}

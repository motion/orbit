import React from 'react'
import { AppView, AppViewProps } from '../AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  console.log('showing', appConfig)
  return (
    <AppView
      key={appConfig.id}
      viewType={viewType}
      title={appConfig.title}
      type={appConfig.type}
      appConfig={appConfig}
    />
  )
}

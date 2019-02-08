import React from 'react'
import { AppView, AppViewProps } from '../AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  return (
    <AppView
      key={appConfig.id}
      viewType={viewType}
      id={appConfig.id}
      title={appConfig.title}
      type={appConfig.type}
      appConfig={appConfig}
    />
  )
}

import React from 'react'
import { AppView, AppViewProps } from './AppView'

export function AppSubView({
  viewType = 'main',
  appConfig,
}: Pick<AppViewProps, 'appConfig' | 'viewType'>) {
  if (!appConfig.identifier) {
    console.warn('no app id given', appConfig)
    return null
  }

  return (
    <AppView
      key={JSON.stringify(appConfig)}
      id={appConfig.id}
      identifier={appConfig.identifier}
      viewType={appConfig.viewType || viewType}
      appConfig={appConfig}
    />
  )
}

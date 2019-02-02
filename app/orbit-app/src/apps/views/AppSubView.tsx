import { AppConfig } from '@mcro/models'
import React from 'react'
import { AppView } from '../AppView'

export function AppSubView({ appConfig }: { appConfig: AppConfig }) {
  return (
    <AppView
      viewType="main"
      id={appConfig.id}
      title={appConfig.title}
      type={appConfig.type}
      appConfig={appConfig}
    />
  )
}

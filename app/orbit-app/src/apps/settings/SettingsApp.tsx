import React from 'react'
import { AppContainer } from '../AppContainer'
import { AppProps } from '../AppTypes'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import { SettingsAppIndex } from './SettingsAppIndex'
import { SettingsAppMain } from './SettingsAppMain'

export function SettingsApp(props: AppProps) {
  return (
    <AppContainer index={<SettingsAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SettingsAppMain {...props} />
    </AppContainer>
  )
}

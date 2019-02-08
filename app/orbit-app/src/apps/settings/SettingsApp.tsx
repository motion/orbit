import React from 'react'
import { App } from '../App'
import { AppProps } from '../AppTypes'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SettingsAppIndex from './SettingsAppIndex'
import SettingsAppMain from './SettingsAppMain'

export function SettingsApp(props: AppProps) {
  return (
    <App index={<SettingsAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SettingsAppMain {...props} />
    </App>
  )
}

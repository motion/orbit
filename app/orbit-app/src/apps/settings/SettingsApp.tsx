import { App, AppDefinition } from '@o/kit'
import React from 'react'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import { SettingsAppIndex } from './SettingsAppIndex'
import { SettingsAppMain } from './SettingsAppMain'

export const SettingsApp: AppDefinition = {
  id: 'settings',
  name: 'Settings',
  icon: '',
  app: props => (
    <App index={<SettingsAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SettingsAppMain {...props} />
    </App>
  ),
}

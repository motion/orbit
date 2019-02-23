import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import { SettingsAppIndex } from './SettingsAppIndex'
import { SettingsAppMain } from './SettingsAppMain'

export const id = 'settings'

export const app: AppDefinition = {
  name: 'Settings',
  icon: '',
  app: props => (
    <App index={<SettingsAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SettingsAppMain {...props} />
    </App>
  ),
}

import { App, createApp } from '@o/kit'
import React from 'react'

import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import { SettingsAppIndex } from './SettingsAppIndex'
import { SettingsAppMain } from './SettingsAppMain'

export default createApp({
  id: 'settings',
  name: 'Settings',
  icon: '',
  app: props => (
    <App index={<SettingsAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SettingsAppMain {...props} />
    </App>
  ),
})

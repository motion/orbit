import { App, createApp } from '@o/kit'
import React from 'react'

import { SettingsAppIndex } from './SettingsAppIndex'
import { SettingsAppMain } from './SettingsAppMain'

export default createApp({
  id: 'settings',
  name: 'Settings',
  icon: 'cog',
  app: props => (
    <App index={<SettingsAppIndex />}>
      <SettingsAppMain {...props} />
    </App>
  ),
})

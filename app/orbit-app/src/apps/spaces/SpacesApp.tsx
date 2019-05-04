import { App, createApp } from '@o/kit'
import React from 'react'

import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SpacesAppIndex from './SpacesAppIndex'
import SpacesAppMain from './SpacesAppMain'

export default createApp({
  id: 'spaces',
  name: 'Spaces',
  icon: '',
  app: props => (
    <App index={<SpacesAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SpacesAppMain {...props} />
    </App>
  ),
})

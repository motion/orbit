import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SpacesAppIndex from './SpacesAppIndex'
import SpacesAppMain from './SpacesAppMain'

export const id = 'spaces'

export const app: AppDefinition = {
  name: 'Spaces',
  icon: '',
  app: props => (
    <App index={<SpacesAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SpacesAppMain {...props} />
    </App>
  ),
}

import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SourcesAppIndex from './SourcesAppIndex'
import { SourcesAppMain } from './SourcesAppMain'

export const SourcesApp: AppDefinition = {
  id: 'sources',
  name: 'Sources',
  icon: '',
  app: props => (
    <App index={<SourcesAppIndex {...props} />} toolBar={<OrbitSettingsToolbar />}>
      <SourcesAppMain {...props} />
    </App>
  ),
}

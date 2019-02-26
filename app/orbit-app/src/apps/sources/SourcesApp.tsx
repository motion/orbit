import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { SourcesAppMain } from './SourcesAppMain'

export const SourcesApp: AppDefinition = {
  id: 'sources',
  name: 'Sources',
  icon: '',
  app: props => (
    <App>
      <SourcesAppMain {...props} />
    </App>
  ),
}

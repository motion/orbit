import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { AppsIndex } from './AppsIndex'
import { AppsMain } from './AppsMain'

export const id = 'apps'

export const app: AppDefinition = {
  name: 'Apps',
  icon: '',
  app: props => (
    <App index={<AppsIndex {...props} />}>
      <AppsMain {...props} />
    </App>
  ),
}

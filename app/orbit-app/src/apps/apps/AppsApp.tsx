import { App, createApp } from '@o/kit'
import React from 'react'

import { AppsIndex } from './AppsIndex'
import { AppsMain } from './AppsMain'

export default createApp({
  id: 'apps',
  name: 'Apps',
  icon: '',
  app: props => (
    <App index={<AppsIndex />}>
      <AppsMain {...props} />
    </App>
  ),
})

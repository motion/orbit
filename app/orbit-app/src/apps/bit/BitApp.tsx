import { App, createApp } from '@o/kit'
import * as React from 'react'

import { BitAppMain } from './BitAppMain'

export default createApp({
  id: 'bit',
  name: 'Bit',
  icon: '',
  app: props => (
    <App>
      <BitAppMain {...props} />
    </App>
  ),
})

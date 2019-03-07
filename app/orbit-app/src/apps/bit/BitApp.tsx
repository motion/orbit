import { App, AppDefinition } from '@o/kit'
import * as React from 'react'
import { BitAppMain } from './BitAppMain'

export const BitApp: AppDefinition = {
  id: 'bit',
  name: 'Bit',
  icon: '',
  app: props => (
    <App>
      <BitAppMain {...props} />
    </App>
  ),
}

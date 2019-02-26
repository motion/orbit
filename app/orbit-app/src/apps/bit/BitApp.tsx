import { App, AppDefinition } from '@mcro/kit'
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

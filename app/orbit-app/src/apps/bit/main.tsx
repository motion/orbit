import { App, AppDefinition } from '@mcro/kit'
import * as React from 'react'
import { BitAppMain } from './BitAppMain'

export const id = 'bit'

export const app: AppDefinition = {
  name: 'Bit',
  icon: '',
  app: props => (
    <App>
      <BitAppMain {...props} />
    </App>
  ),
}

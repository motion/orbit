import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { OnboardMain } from './OnboardMain'

export const id = 'onboard'

export const app: AppDefinition = {
  icon: '',
  name: 'Onboard',
  app: () => (
    <App>
      <OnboardMain />
    </App>
  ),
}

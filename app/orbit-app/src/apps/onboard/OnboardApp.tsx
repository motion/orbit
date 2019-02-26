import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { OnboardMain } from './OnboardMain'

export const OnboardApp: AppDefinition = {
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: () => (
    <App>
      <OnboardMain />
    </App>
  ),
}

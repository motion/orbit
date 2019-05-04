import { App, createApp } from '@o/kit'
import React from 'react'

import { OnboardMain } from './OnboardMain'

export default createApp({
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: () => (
    <App>
      <OnboardMain />
    </App>
  ),
})

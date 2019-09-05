import { createApp } from '@o/kit'

import { DemoAppUserManager } from './DemoAppUserManager'

export default createApp({
  id: 'demo-app-user-manager',
  name: 'App Demo: User Manager',
  icon: 'tool',
  iconColors: ['rgb(240, 18, 190)', 'rgb(220, 5, 170)'],
  app: DemoAppUserManager,
  viewConfig: {
    transparentBackground: false,
  },
})

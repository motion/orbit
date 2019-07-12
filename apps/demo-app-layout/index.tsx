import { createApp } from '@o/kit'

import { DemoLayoutApp } from './DemoLayoutApp'

export default createApp({
  id: 'demo-app-layout',
  name: 'App Demo: Layout',
  icon: 'layout',
  iconColors: ['rgb(177, 13, 201)', 'rgb(157, 13, 191)'],
  app: DemoLayoutApp,
})

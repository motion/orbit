import { createApp } from '@o/kit'

import { DemoGridApp } from './DemoGridApp'

export default createApp({
  id: 'demo-app-api-gri',
  name: 'Demo App: API Grid',
  icon: 'grid',
  iconColors: ['rgb(46, 204, 64)', 'rgb(255, 65, 54)'],
  app: DemoGridApp,
})

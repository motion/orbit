import { createApp } from '@o/kit'
import { DemoGridApp } from './DemoGridApp'

export default createApp({
  id: 'demo-app-api-grid',
  name: 'Demo App: API Grid',
  icon: 'grid',
  app: DemoGridApp,
})

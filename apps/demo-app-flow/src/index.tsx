import { createApp } from '@o/kit'
import { DemoAppFlow } from './DemoAppFlow'

export default createApp({
  id: 'demo-app-flow',
  name: 'App Demo: Flow',
  icon: 'flow',
  app: DemoAppFlow,
})

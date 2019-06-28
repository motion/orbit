import { App, createApp } from '@o/kit'
import React from 'react'

export default createApp({
  id: 'demo-app-flow',
  name: 'App Demo: Flow',
  icon: 'flow',
  iconColors: ['rgb(255, 133, 27)', 'rgb(235, 123, 17)'],
  app: () => (
    <App>
      <AppMain />
    </App>
  ),
})

function AppMain() {
  return null
}

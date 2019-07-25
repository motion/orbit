import { App, createApp } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'

export default createApp({
  id: 'workspace-app',
  name: 'Workspace app',
  icon: 'flow',
  iconColors: ['rgb(255, 133, 27)', 'rgb(235, 123, 17)'],
  app: () => (
    <App>
      <AppMain />
    </App>
  ),
})

function AppMain() {
  return <Title>Nah222</Title>
}

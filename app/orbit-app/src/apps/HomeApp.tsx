import { App, createApp } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'

function HomeMain() {
  return <Title>hi</Title>
}

export default createApp({
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: () => (
    <App>
      <HomeMain />
    </App>
  ),
})

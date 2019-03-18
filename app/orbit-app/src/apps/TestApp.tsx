import { App, createApp } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'

function TestMain() {
  return <Title>hi test</Title>
}

export const TestApp = createApp({
  id: 'test',
  icon: '',
  name: 'Test',
  app: () => (
    <App>
      <TestMain />
    </App>
  ),
})

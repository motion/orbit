import { App, AppProps, createApp } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Title>hi</Title>
    </App>
  )
}

export default createApp({
  id: 'custom2',
  name: 'Custom App 2',
  icon: '',
  app: CustomApp2,
})

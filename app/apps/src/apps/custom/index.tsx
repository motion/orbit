import { App, AppProps, createApp } from '@mcro/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

function CustomApp(props: AppProps) {
  return (
    <App>
      <CustomAppMain {...props} />
    </App>
  )
}

export default createApp({
  id: 'custom',
  name: 'Custom',
  icon: '',
  app: CustomApp,
})

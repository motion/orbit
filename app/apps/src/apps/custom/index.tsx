import { App, AppProps, createApp } from '@mcro/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

export default createApp({
  id: 'custom',
  name: 'Custom',
  icon: '',
  app: (props: AppProps) => (
    <App>
      <CustomAppMain {...props} />
    </App>
  ),
})

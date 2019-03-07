import { App, AppMainProps, createApp } from '@o/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

function CustomApp(props: AppMainProps) {
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

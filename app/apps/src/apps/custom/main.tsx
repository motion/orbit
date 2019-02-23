import { App, AppDefinition, AppProps } from '@mcro/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

function CustomApp(props: AppProps) {
  return (
    <App>
      <CustomAppMain {...props} />
    </App>
  )
}

export const app: AppDefinition = {
  name: 'Custom',
  icon: '',
  app: CustomApp,
}

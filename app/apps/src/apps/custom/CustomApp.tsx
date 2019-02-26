import { App, AppDefinition, AppProps } from '@mcro/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

export const CustomApp: AppDefinition = {
  id: 'custom',
  name: 'Custom',
  icon: '',
  app: (props: AppProps) => (
    <App>
      <CustomAppMain {...props} />
    </App>
  ),
}

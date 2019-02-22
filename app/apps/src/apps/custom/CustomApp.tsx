import { App, AppProps } from '@mcro/kit'
import React from 'react'
import { CustomAppMain } from './CustomAppMain'

export function CustomApp(props: AppProps) {
  return (
    <App>
      <CustomAppMain {...props} />
    </App>
  )
}

import React from 'react'
import { AppContainer } from '../AppContainer'
import { AppProps } from '../AppTypes'
import { CustomAppMain } from './CustomAppMain'

export function CustomApp(props: AppProps) {
  return (
    <AppContainer>
      <CustomAppMain {...props} />
    </AppContainer>
  )
}

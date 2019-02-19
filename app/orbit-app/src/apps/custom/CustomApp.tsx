import React from 'react'
import { AppContainer } from '../AppContainer'
import { AppProps } from '../AppTypes'
import { CustomAppMain } from './CustomAppMain'

export function CustomApp(props: AppProps) {
  console.warn('render custom app.......')
  return (
    <AppContainer>
      <CustomAppMain {...props} />
    </AppContainer>
  )
}

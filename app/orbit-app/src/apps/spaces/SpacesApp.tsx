import React from 'react'
import { App } from '../App'
import { AppProps } from '../AppTypes'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SpacesAppIndex from './SpacesAppIndex'
import SpacesAppMain from './SpacesAppMain'

export function SpacesApp(props: AppProps) {
  return (
    <App index={<SpacesAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SpacesAppMain {...props} />
    </App>
  )
}
